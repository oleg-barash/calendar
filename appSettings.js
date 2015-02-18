/**
 * Created by ovb5 on 18.02.2015.
 */
var calendar = (function(){
    var weekday = new Array(7);
    weekday[0]=  "Понедельник";
    weekday[1] = "Вторник";
    weekday[2] = "Среда";
    weekday[3] = "Четверг";
    weekday[4] = "Пятница";
    weekday[5] = "Суббота";
    weekday[6] = "Воскресение";
    Date.prototype.getWeekDay = function (date) {

        if (this instanceof Date) {
            var dayNumber = this.getDay();
            return weekday[dayNumber];
        }
        if (date instanceof Date){
            var dayNumber = date.getDay();
            return weekday[dayNumber];
        }
    };
    return{
        messages: {
            dateParameterRequired: "Необходимо указать дату"
        }
    }
})();