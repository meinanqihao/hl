module.exports = (function(){
    Date.prototype.format = function(formatStr){
        var str = formatStr;
        var Week = ['日','一','二','三','四','五','六'];

        str=str.replace(/yyyy|YYYY/,this.getFullYear());
        str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

        str=str.replace(/MM/,this.getMonth()>8?(this.getMonth() + 1).toString():'0' + (this.getMonth() + 1));
        str=str.replace(/M/g,this.getMonth());

        str=str.replace(/w|W/g,Week[this.getDay()]);

        str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
        str=str.replace(/d|D/g,this.getDate());

        str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
        str=str.replace(/h|H/g,this.getHours());
        str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
        str=str.replace(/m/g,this.getMinutes());

        str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
        str=str.replace(/s|S/g,this.getSeconds());

        return str;
    }
    String.prototype.toDate = function(){
        var v=this;
        if(v==null||v=="")return "";
        if("currDate" == v){
            return new Date();
        }
        v = v +"";
        var arr = v.replace(/[\.]/g,"").split("");
        switch(v.length){
            case 14:
                arr.splice(12,0,':');
            case 12:
                arr.splice(10,0,':');
            case 10:
                arr.splice(8,0,' ');
            case 8:
                arr.splice(6,0,'/');
                arr.splice(4,0,'/');
                break;
        }
        return new Date(Date.parse(arr.join('')));
    }
})();