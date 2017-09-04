/**
 * Created by likeke on 2017/9/3.
 */
function DataTable(data, columns) {
    this.data = data;
    this.columns = columns;
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
    }
};
DataTable.prototype.draw = function (container) {
    container.innerHTML = "";
    var _t = this;
    var css = _t.tools.css;
    var table = _t.table;
    var row = null, cell = null;
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
        _t.onrowdraw(row, _t.thead);
    }
    //体
    var tbody = document.createElement('tbody');
    var cellData = [];
    for (i = 0, l = _t.data.length; i < l; i++) {
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
DataTable.prototype.refreshData = function () {
    var _t = this;
    var css = _t.tools.css;
    var tbody = _t.table.querySelector('tbody');
    var rows = tbody.querySelectorAll('tr'), row = null, cells = null, cell = null, cellData = null;
    for (var i = 0, l = _t.data.length; i < l; i++) {
        row = rows[i];
        cells = row.querySelectorAll('td');
        for (var j = 0, le = _t.columns.length; j < le; j++) {
            cell = cells[j];
            cellData = _t.data[i][_t.columns[j].name] || _t.columns[j].default;
            cell.innerHTML = cellData;
            _t.oncelldraw(cell, cellData);
            _t.columns[j].otherCss && css(cell, _t.columns[j].otherCss);
        }
        _t.onrowdraw(row, _t.data[i]);
    }
};