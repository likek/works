/**
 * Created by likeke on 2017/9/3.
 */

/*
 * tools
 * */
Array.prototype.where = function (match) {
    var temp = [];
    for (var i = 0; i < this.length; i++) {
        if (match(this[i])) temp.push(this[i]);
    }
    return temp;
};

/*
 *DataTable类开始
 * */
function DataTable() {
    this.data = [];
    this.columns = [];
    this.filterBy = null;
    this.sortBy = null;
    this.thead = [];
    this.tfoot = [];
    this.container = null;
    this.table = document.createElement('table');
    this.ontabledraw = function (table, tableData) {
    };
    this.onrowdraw = function (row, rowData) {
    };
    this.oncelldraw = function (cell, cellData) {
    }
}
DataTable.prototype.tools = new function () {
    this.css = function (ele, css) {
        for (var item in css) {
            if (css.hasOwnProperty(item)) {
                ele.style[item] = css[item];
            }
        }
    };
    this.JSONSort = function (json, sortBy) {
        function comp(sortBy) {
            return new Function("a", "b", "return a." + sortBy + ".toString().localeCompare(b." + sortBy + ".toString());");
        }
        if(Object.prototype.toString.call(sortBy).slice(8,-1) == "Function"){
            return json.sort(sortBy);
        }
        if(sortBy.slice(0,4)==="${-}"){
            return json.sort(comp(sortBy)).reverse();
        }
        return json.sort(comp(sortBy));
    };
    this.filter = function (filterList, data) {
        var _t = this;
        var newData = [].concat(data);
        if(Object.prototype.toString.call(filterList).slice(8,-1) == "Function"){
            newData = newData.where(function (i) {
                return filterList(i);
            })
        }else {
            for (var item in filterList) {
                if (filterList.hasOwnProperty(item)) {
                    !function (item) {
                        newData = newData.where(function (i) {
                            return !filterList[item].test(i[item]);
                        });
                    }(item);
                }
            }
        }
        return newData;
    }
};
DataTable.prototype.dataFormat = function (data) {
    var _t = this;
    var filter = _t.tools.filter;
    var JSONSort = _t.tools.JSONSort;
    var newData = [].concat(data);
    newData = newData.where(function (i) {
        return i != null && Object.keys(i).length;
    });
    if (_t.filterBy) {
        newData = filter(_t.filterBy, newData);
    }
    if (_t.sortBy) {
        newData = JSONSort(newData, _t.sortBy);
    }
    return newData;
};

DataTable.prototype.drawBody = function (newData) {
    var _t = this;
    var css = _t.tools.css;
    var colLength = _t.columns.length;
    var data = newData && _t.dataFormat(newData);
    _t.data =  _t.data || [].concat(data);
    if(_t.data.length ==0 && newData.length == 0){
        return this;
    }
    _t.data = _t.dataFormat(_t.data);
    var compLength = data.length - _t.data.length;
    var tbody = _t.table.querySelector('tbody')||document.createElement('tbody');
    var rows = tbody.querySelectorAll('tr');
    var row = null, cells = null, cell = null,l,le;
    if (compLength > 0) {
        for (var i = 0; i < compLength; i++) {
            row = document.createElement('tr');
            for (var j = 0; j < colLength; j++) {
                cell = document.createElement('td');
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
    }
    if (compLength < 0) {
        for (i = 0; i < Math.abs(compLength); i++) {
            tbody.removeChild(rows[_t.data.length - i - 1]);
        }
    }
    rows = tbody.querySelectorAll('tr');
    for (i = 0, l = data.length; i < l; i++) {
        row = rows[i];
        row.index = i;
        row.rowType = "tbody";
        cells = row.querySelectorAll('td');
        for (j = 0, le = _t.columns.length; j < le; j++) {
            cell = cells[j];
            cell.index = j;
            cell.cellType = "tbody";
            cellData = data[i][_t.columns[j].name] || _t.columns[j].default;
            cell.innerHTML = cellData;
            _t.columns[j].otherCss && css(cell, _t.columns[j].otherCss);
            _t.oncelldraw(cell, cellData);
        }
        _t.onrowdraw(row, data[i]);
    }
    return {
        tbody:tbody,
        data:data
    };
};

DataTable.prototype.drawHead = function () {
    var _t = this;
    var row = null, cells = null, cell = null;
    var thead = _t.table.querySelector('thead')||document.createElement('thead');
    if (_t.thead.length != 0) {
        if(thead.childElementCount === 0){
            row = document.createElement('tr');
            for(i=0,l=_t.thead.length;i<l;i++){
                cell = document.createElement('th');
                row.appendChild(cell);
            }
            thead.appendChild(row);
        }
        row = thead.querySelector('tr');
        row.index = 0;
        row.rowType = "thead";
        cells = row.querySelectorAll('th');
        for (var i = 0, l = _t.thead.length; i < l; i++) {
            cells[i].innerHTML = _t.thead[i];
            cells[i].index = i;
            cells[i].cellType = "thead";
            _t.oncelldraw(cells[i], _t.thead[i]);
        }
        _t.onrowdraw(row, _t.thead);
    }
    return thead;
};

DataTable.prototype.drawFoot = function () {
    var _t = this;
    var row = null, cells = null, cell = null;
    var tfoot = _t.table.querySelector('tfoot')||document.createElement('tfoot');
    if (_t.tfoot.length != 0) {
        if(tfoot.childElementCount === 0){
            row = document.createElement('tr');
            for(i=0,l=_t.tfoot.length;i<l;i++){
                cell = document.createElement('td');
                row.appendChild(cell);
            }
            tfoot.appendChild(row);
        }
        row = tfoot.querySelector('tr');
        row.index  = 0;
        row.rowType = "tfoot";
        cells = row.querySelectorAll('td');
        for (var i = 0, l = _t.tfoot.length; i < l; i++) {
            cells[i].innerHTML = _t.tfoot[i];
            cells[i].index = i;
            cells[i].cellType = 'tfoot';
            _t.oncelldraw(cells[i], _t.tfoot[i]);
        }
        _t.onrowdraw(row, _t.tfoot);
    }
    return tfoot;
};

DataTable.prototype.draw = function (newData) {
    var _t = this;
    var table = _t.table;
    var container = _t.container;
    var tbodyO = _t.drawBody(newData);
    var thead =  _t.drawHead();
    var tbody = tbodyO.tbody;
    var tfoot = _t.drawFoot();
    var data = tbodyO.data;
    _t.data = data;
    thead && table.querySelector('thead') || table.appendChild(thead);
    tbody && table.querySelector('tbody') || table.appendChild(tbody);
    tfoot && table.querySelector('tfoot')|| table.appendChild(tfoot);
    table && container.hasChildNodes(table)||container.appendChild(table);
    table.style.width = "100%";
    table.style.textAlign = "center";
    table.cellPadding = 0;
    table.setAttribute('class', 'dataTable');
    _t.ontabledraw(table, data);
};
