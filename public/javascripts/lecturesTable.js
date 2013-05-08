 var editor;
$(document).ready(function () {
    var name = $('#appid').val();
    editor = new $.fn.dataTable.Editor( {
        "sAjaxDataProp" : 'lectures',
        "ajaxUrl": "/lectures/update/" + name,
        "domTable": "#lectures",
        "fields": [ {
                "label": "Title:",
                "name": "lecttitle"
            }, {
                "label": "Starting date:",
                "name": "sdate"
            }, {
                "label": "Ending date",
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
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        "sAjaxDataProp" : 'lectures',
        "sAjaxSource": "/lectures/list/" + name,
        "sPaginationType": "bootstrap",
        "aoColumns": [
            { "mData": "lecttitle" },
            { "mData": "sdate" },
            { "mData": "edate" },
            { "mData": "lecturer" },
            { "mData": "excerpt" },
            { "mData": "location" }
        ] ,
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