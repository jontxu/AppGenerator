var editor;
$(document).ready(function () {
    var name = $('#appid').val();
    editor = new $.fn.dataTable.Editor( {
        "ajaxUrl": {
          "create": "/lectures/new/" + name,
          "edit": "/lectures/update/" + name,
          "remove": "/lectures/delete/" + name
        },
        "domTable": "#lectures",
        "fields": [ {
                "label": "ID:",
                "name": "lecname"
            }, {
                "label": "Title:",
                "name": "lecttitle"
            },{
                "label": "Event (do not change):",
                "name": "ename",
                "default": name
            }, {
                "label": "Starting date:",
                "name": "sdate"
            }, {
                "label": "Ending date:",
                "name": "edate"
            }, {
                "label": "Lecturer/s:",
                "name": "lecturer"
            }, {
                "label": "Excerpt:",
                "name": "excerpt"
            }, {
                "label": "Location:",
                "name": "location"
            }
        ]
      });
    $('#lectures').dataTable({
        "sDom": "<'row-fluid'<'span6'T><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        "sAjaxDataProp" : 'lectures',
        "sAjaxSource": "/lectures/list/" + name,
        "aoColumns": [
            { "mData": "lecttitle" },
            { "mData": "sdate" },
            { "mData": "edate" },
            { "mData": "lecturer" },
            { "mData": "excerpt" },
            { "mData": "location" }
        ],
        "oTableTools": {
            "sRowSelect": "multi",
            "aButtons": [
                { "sExtends": "editor_create", "editor": editor },
                { "sExtends": "editor_edit",   "editor": editor },
                { "sExtends": "editor_remove", "editor": editor }
            ]
        }
    });
});