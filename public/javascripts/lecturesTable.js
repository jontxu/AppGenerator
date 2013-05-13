var editor;
$(document).ready(function () {
    var name = $('#appid').val();
    var token = $('#csrf').val();
    editor = new $.fn.dataTable.Editor( {
        "ajaxUrl": {
          "create": "/lectures/new/" + name,
          "edit": "/lectures/update/" + name,
          "remove": "/lectures/delete/" + name
        },
        "domTable": "#lectures",
        "idSrc" : "lecname",
        "ajax": function (method, url, data, successCallback, errorCallback) {
            $.ajax({
                "type": method,
                "url":  url,
                "data": data,
                "dataType": "json",
                "headers" : {
                    'X-CSRF-Token' : token
                },
                "success": function (json) {
                    successCallback( json );
                },
                "error": function (xhr, error, thrown) {
                    errorCallback( xhr, error, thrown );
                }
            });
        },
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
                "name": "sdate",
                "default" : "yyyy-MM-dd hh:mm:ss"
            }, {
                "label": "Ending date:",
                "name": "edate",
                "default" : "yyyy-MM-dd hh:mm:ss"
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