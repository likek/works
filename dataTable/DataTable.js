/**
 * Created by likeke on 2017/9/3.
 */
function DataTable(data,columns) {
    this.data = data;
    this.columns = columns;
    this.thead = [];
    this.tfoot = [];
    this.ontabledraw = function (table,tableData) {};
    this.onrowdraw = function (row,rowData) {};
    this.oncelldraw = function (cell,cellData) {}
}
DataTable.prototype.draw = function (container) {
    container.innerHTML = "";
    var _t = this;
    var table = document.createElement('table');
    var row = null,cell = null;
    //头
    var thead = null;
    if(_t.thead.length!=0){
        thead = document.createElement('thead');
        row = document.createElement('tr');
        for(var i = 0,l=_t.thead.length;i<l;i++){
            cell = document.createElement('th');
            cell.innerHTML = _t.thead[i];
            row.appendChild(cell);
            _t.oncelldraw(cell,_t.thead[i]);
        }
        thead.appendChild(row);
        _t.onrowdraw(row,thead);
    }
    //体
    var tbody = document.createElement('tbody');
    var cellDate = [];
    for(i = 0,l=_t.data.length;i<l;i++){
        row = document.createElement('tr');
        for(var j = 0,le = _t.columns.length;j<le;j++){
            cell = document.createElement('td');
            cellDate =  _t.data[i][_t.columns[j].name]||_t.columns[j].default;
            cell.innerHTML = cellDate;
            row.appendChild(cell);
            _t.oncelldraw(cell,cellDate);
            _t.columns[j].otherCss && css(cell,_t.columns[j].otherCss);
        }
        tbody.appendChild(row);
        _t.onrowdraw(row,_t.data[i]);
    }
    //尾
    var tfoot = null;
    if(_t.tfoot.length!=0){
        tfoot = document.createElement('tfoot');
        row = document.createElement('tfoot');
        for(i=0,l=_t.tfoot.length;i<l;i++){
            cell = document.createElement('td');
            cell.innerHTML = _t.tfoot[i];
            row.appendChild(cell);
            _t.oncelldraw(cell,_t.tfoot[i]);
        }
        tfoot.appendChild(row);
        _t.onrowdraw(row,_t.tfoot);
    }
    thead && table.appendChild(thead);
    table.appendChild(tbody);
    tfoot && table.appendChild(tfoot);
    _t.ontabledraw(table,_t.data);
    container.appendChild(table);

    function css(ele,css) {
        for(var item in css){
            if(css.hasOwnProperty(item)){
                ele.style[item] = css[item];
            }
        }
    }
};