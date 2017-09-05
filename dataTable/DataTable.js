/**
 * Created by likeke on 2017/9/3.
 */
function DataTable(data, columns) {
    this.data = [].concat(data);
    this.columns = columns;
    this.filterBy = null;
    this.dataSort = null;
    this.thead = [];
    this.tfoot = [];
    this.table = document.createElement('table');
    this.ontabledraw = function (table, tableData) {
    };
    this.onrowdraw = function (row, rowData) {
    };
    this.oncelldraw = function (cell, cellData) {
    }
}
DataTable.prototype.tools = {
    css: function (ele, css) {
        for (var item in css) {
            if (css.hasOwnProperty(item)) {
                ele.style[item] = css[item];
            }
        }
    },
    JSONSort: function (json, a, b) {
        var newJson = (function temp(arr) {
            var i = arr.lastIndexOf(null);
            if (i == -1) {
                return arr;
            }
            arr.splice(i, 1);
            return temp(arr);
        })(json);

        function comp(a, b) {
            return new Function("a", "b", "return  " + a + ".toString().charCodeAt() -  " + b + ".toString().charCodeAt();");
        }

        return newJson.sort(comp(a, b));
    },
    filter: function (filterList,data) {
        var _t = this;
        var newData = [].concat(data);
        for (var item in filterList) {
            if (filterList.hasOwnProperty(item)) {
                for (var i = 0, l = newData.length; i < l; i++) {
                    if (filterList[item].indexOf(newData[i][item]) != -1) {
                        newData.splice(i,1);
                        i--;
                        l--;
                    }
                }
            }
        }
        return newData;
    }
};
DataTable.prototype.draw = function (container) {
    container.innerHTML = "";
    var _t = this;
    var css = _t.tools.css;
    var table = _t.table;
    var row = null, cell = null;
    _t.data = _t.dataFormat(_t.data);
    //头
    var thead = null;
    if (_t.thead.length != 0) {
        thead = document.createElement('thead');
        row = document.createElement('tr');
        for (var i = 0, l = _t.thead.length; i < l; i++) {
            cell = document.createElement('th');
            cell.innerHTML = _t.thead[i];
            row.appendChild(cell);
            _t.oncelldraw(cell, _t.thead[i]);
        }
        thead.appendChild(row);
        // _t.onrowdraw(row, _t.thead);
    }
    //体
    var tbody = document.createElement('tbody');
    var cellData = [];
    for (i = 0, l = _t.data.length; i < l; i++) {
        if (_t.data[i] == null) {
            continue;
        }
        row = document.createElement('tr');
        for (var j = 0, le = _t.columns.length; j < le; j++) {
            cell = document.createElement('td');
            cellData = _t.data[i][_t.columns[j].name] || _t.columns[j].default;
            cell.innerHTML = cellData;
            row.appendChild(cell);
            _t.oncelldraw(cell, cellData);
            _t.columns[j].otherCss && css(cell, _t.columns[j].otherCss);
        }
        tbody.appendChild(row);
        _t.onrowdraw(row, _t.data[i]);
    }
    //尾
    var tfoot = null;
    if (_t.tfoot.length != 0) {
        tfoot = document.createElement('tfoot');
        row = document.createElement('tfoot');
        for (i = 0, l = _t.tfoot.length; i < l; i++) {
            cell = document.createElement('td');
            cell.innerHTML = _t.tfoot[i];
            row.appendChild(cell);
            _t.oncelldraw(cell, _t.tfoot[i]);
        }
        tfoot.appendChild(row);
        _t.onrowdraw(row, _t.tfoot);
    }
    thead && table.appendChild(thead);
    table.appendChild(tbody);
    tfoot && table.appendChild(tfoot);
    table.style.width = "100%";
    table.style.textAlign = "center";
    table.cellPadding = 0;
    table.setAttribute('class', 'dataTable');
    _t.ontabledraw(table, _t.data);
    container.appendChild(table);
};

DataTable.prototype.dataFormat =function (data) {
    var _t = this;
    var filter = _t.tools.filter;
    var JSONSort = _t.tools.JSONSort;
    var newData = [].concat(data);
    if(_t.filterBy){
        newData = filter(_t.filterBy,newData);
    }
    if (_t.dataSort) {
        newData = JSONSort(newData, "a." + _t.dataSort, "b." + _t.dataSort);
    }
    return newData;
};


DataTable.prototype.refreshData = function (newData) {
    var _t = this;
    var css = _t.tools.css;
    var data = _t.dataFormat(newData);
    var compLength = data.length - _t.data.length;
    console.log(data.length+"---"+_t.data.length);
    var colLength = _t.columns.length;
    var tbody = _t.table.querySelector('tbody');
    var rows = tbody.querySelectorAll('tr'), row = null, cells = null, cell = null, cellData = null,l=0,le=0;
    if(compLength>0){
        for(var i=0;i<compLength;i++){
            row = document.createElement('tr');
            for(var j=0;j<colLength;j++){
                cell = document.createElement('td');
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
    }
    if(compLength<0){
        for(i = 0;i<Math.abs(compLength);i++){
            tbody.removeChild(rows[_t.data.length - i - 1]);
        }
    }
    _t.data = [].concat(data);
    _t.data = _t.dataFormat(_t.data);
    rows = tbody.querySelectorAll('tr');
    for (i = 0, l = _t.data.length; i < l; i++) {
        row = rows[i];
        cells = row.querySelectorAll('td');
        for (j = 0, le = _t.columns.length; j < le; j++) {
            cell = cells[j];
            cellData = _t.data[i][_t.columns[j].name] || _t.columns[j].default;
            cell.innerHTML = cellData;
            _t.columns[j].otherCss && css(cell, _t.columns[j].otherCss);
            _t.oncelldraw(cell, cellData);
        }
        _t.onrowdraw(row, _t.data[i]);
    }
};