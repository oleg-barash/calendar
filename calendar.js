/**
 * Created by ovb5 on 18.02.2015.
 */

function getBeginOfDay(date){
    var cache = {};
    if (cache[date] == null){
        cache[date] = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    return cache[date];
}

function getNumericDate(date){
    var cache = {};
    if (cache[date] == null){
        cache[date] = +date;
    }
    return cache[date];
}

var Note = Backbone.Model.extend({
    constructor: function(date) {
        if (date instanceof Date){
            console.error(calendar.messages.dateParameterRequired);
        }
        this.createdAt = new Date();
        this.date = date;
        this.message = "Текст";
        Backbone.Model.apply(this, arguments);
    }
});

var Notes = Backbone.Collection.extend({model: Note});
var NoteList = new Notes();

var NoteView = Backbone.View.extend({
    events: {
        "click": "editNote",
        "click .deleteNote": "deleteNote",
        "click .saveNote": "save",
        "focusout input": "save"
    },
    className: "note",
    tagName:  "li",
    template: _.template($('#noteView').html()),
    deleteNote: function(e){
        this.model.destroy();
    },
    editNote: function(e){
        this.$el.addClass("editing");
    },
    save: function(e){
        this.model.set({'message': this.input.val()});
        this.$el.removeClass("editing");
    },
    render: function() {
        this.$el.html(this.template(this.model));
        this.input = this.$('input.noteInput');
        return this;
    }
});

var DayModel = Backbone.Model.extend({

    constructor: function(date) {
        if (!(date instanceof Date)){
            console.error(calendar.messages.dateParameterRequired);
            throw { message: calendar.messages.dateParameterRequired };
        }
        this.date = date;
        this.weekDay = date.getWeekDay();
        this.id = +(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()));
        Backbone.Model.apply(this, arguments);
    }
});

var Days = Backbone.Collection.extend({model: DayModel});
var DaysList = new Days();
var DayView = Backbone.View.extend({
    tagName:  "li",
    events: {
        "dbclick": "addNote",
        "click .addNote": "addNote"
    },
    addNote: function(e){
        var date = this.model.date;
        var note = new Note(date);
        var view = new NoteView({model: note});
        this.$("#notes").append(view.render().el);
        NoteList.add(note);
    },
    template: _.template($('#dayView').html()),
    initialize: function(data){
        this.listenTo( Backbone, 'changed-current-date', function (newDate) {
            if (this.model.id == newDate){
                this.$el.addClass("active");
            }
            else{
                this.$el.removeClass("active");
            }
        }, this );
    },
    render: function() {
        this.$el.html(this.template(this.model));
        return this;
    }
});

var AppView = Backbone.View.extend({
    defaults: {
        beforeCurrentDisplayDays: 1,
        afterCurrentDisplayDays: 1
    },
    el: $("#calendar"),
    events: {
        "click a.next": "nextDay",
        "click a.back": "prevDay"
    },
    initialize: function(){
        for (var i = -this.defaults.beforeCurrentDisplayDays, max = this.defaults.afterCurrentDisplayDays; i <= max; i++){
            var date = new Date();
            date.setDate(date.getDate()+i);
            this.addDay(date);
        }
        this.currentDate = new Date();
    },
    addDay: function(date){
        var dayModel = new DayModel(date)
        var view = new DayView({model: dayModel});
        var compiledView = view.render().el;
        this.$("#days").append(compiledView);
        DaysList.add(dayModel);
    },
    nextDay: function(e){
        this.currentDate = getBeginOfDay(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + 1));
        Backbone.trigger('changed-current-date', getNumericDate(this.currentDate) );
    },
    prevDay: function(e){
        this.currentDate = getBeginOfDay(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 1));
        Backbone.trigger('changed-current-date', getNumericDate(this.currentDate) );
    }
});

var App = new AppView();