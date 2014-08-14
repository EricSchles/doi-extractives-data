//https://docs.google.com/spreadsheet/pub?key=0AjPWVMj9wWa6dGw3b1c3ZHRSMW92UTJlNXRLTXZ0RUE&single=true&gid=0&output=csv
function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
};

function clean_monetary_float (f){
	f = f.replace(/,/g , '');
	f= f.replace('(','-');
	f=f.replace(')','');
	return parseFloat(f.replace("$",""));
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function text_money(f){
	f = parseFloat(f);
	var s = f.formatMoney(2,'.',',');
	var t;
	if (s.length>19)//trillion
	{
		t="trillion"
	}
	else if (s.length>15)//Billions
	{
		t="billion"
	}
	else if (s.length>11)//Millions
	{
		t="million"
	}
	else if (s.length>7)//Thousands
	{
		t="thousand"
	}
	s=s.substring(0,s.search(',')+2);
	s=s.replace(",",".");
	return s+=" "+t;
}

function sort_dataTable(dataTable, dataField, that)
{
	dataTable.sortBy(function(d){return d[dataField]});
	if (dataTable.order() == d3.ascending)
		dataTable.order(d3.descending);
	else
		dataTable.order(d3.ascending);
	dc.renderAll();
	graphCustomizations();
}

function text_filter(dim,q){
	var re = new RegExp(q,"i")
	if (q != '') {
    dim.filter(function(d) {
        return 0 == d.search(re);
    });
	} else {
	    dim.filterAll();
	}



	dc.redrawAll();
	graphCustomizations();
}

function update_graph_options(elem,dimension){
	var a=[];
	elem.each(function(){
		if ($(this).is(':checked')){
			a.push($(this).val());
		}
	});
	dimension.filterAll();
	dimension.filter(function(d){	
			if (a.indexOf(d) > -1)
			{
				return true;
			}
			else 
				return false;
	});
	


	dc.redrawAll();
	graphCustomizations();
}

function download_data(dimension){
	var f=eval(dimension);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	f.reverse();
	//print_filter(f);
	//console.log(f[0]["Company Name"]);
	var keys = Object.keys(f[0]);
	if (keys.indexOf('')>-1)
		keys.splice(keys.indexOf('',1));
	if (keys.indexOf('undefined')>-1)
		keys.splice(keys.indexOf('undefined',1));
	if (keys.indexOf(' ')>-1)
		keys.splice(keys.indexOf(' ',1));
	var csv="data:text/csv;charset=utf-8,";
	for (var i=0;i<keys.length;i++)
	{
			csv +=keys[i]+",";
	}
		
	csv += "\n";

	f.forEach(function(d){
		for (var n=0; n<keys.length;n++)
			csv += d[keys[n]]+",";
		csv+="\n";
	});
	var encodeUri = encodeURI(csv);
	var link=document.createElement("a");
	link.setAttribute("href",encodeUri);
	link.setAttribute("download","filtered_data.csv");
	link.click();
	
}




