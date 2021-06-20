var sql_box_locked = false, only_once_elements = [], ajax_message_count = 0, codemirror_editor = false,
    chart_activeTimeouts = {};

function getWindowSize(a) {
    a = a || window;
    return {
        width: a.innerWidth || (a.documentElement !== undefined ? a.documentElement.clientWidth : false) || $(a).width(),
        height: a.innerHeight || (a.documentElement !== undefined ? a.documentElement.clientHeight : false) || $(a).height()
    }
}

$.ajaxPrefilter(function (a, b) {
    var c = (new Date).getTime() + "" + Math.floor(Math.random() * 1E6);
    if (typeof a.data == "string") a.data += "&_nocache=" + c; else if (typeof a.data == "object") a.data = $.extend(b.data, {_nocache: c})
});

function PMA_prepareForAjaxRequest(a) {
    a.find("input:hidden").is("#ajax_request_hidden") || a.append('<input type="hidden" id="ajax_request_hidden" name="ajax_request" value="true" />')
}

function suggestPassword(a) {
    var b = a.generated_pw;
    b.value = "";
    for (i = 0; i < 16; i++) b.value += "abcdefhjmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWYXZ".charAt(Math.floor(Math.random() * 53));
    a.text_pma_pw.value = b.value;
    a.text_pma_pw2.value = b.value;
    return true
}

function parseVersionString(a) {
    if (typeof a != "string") return false;
    var b = 0, c = a.split("-");
    if (c.length >= 2) if (c[1].substr(0, 2) == "rc") b = -20 - parseInt(c[1].substr(2)); else if (c[1].substr(0, 4) == "beta") b = -40 - parseInt(c[1].substr(4)); else if (c[1].substr(0, 5) == "alpha") b = -60 - parseInt(c[1].substr(5)); else if (c[1].substr(0, 3) == "dev") b = 0;
    var d = a.split(".");
    a = parseInt(d[0]) || 0;
    c = parseInt(d[1]) || 0;
    var e = parseInt(d[2]) || 0;
    d = parseInt(d[3]) || 0;
    return a * 1E8 + c * 1E6 + e * 1E4 + d * 100 + b
}

function PMA_current_version() {
    var a = parseVersionString(pmaversion), b = parseVersionString(PMA_latest_version),
        c = PMA_messages.strLatestAvailable + " " + PMA_latest_version;
    if (b > a) {
        var d = $.sprintf(PMA_messages.strNewerVersion, PMA_latest_version, PMA_latest_date);
        klass = Math.floor(b / 1E4) == Math.floor(a / 1E4) ? "error" : "notice";
        $("#maincontainer").after('<div class="' + klass + '">' + d + "</div>")
    }
    if (b == a) c = " (" + PMA_messages.strUpToDate + ")";
    $("#li_pma_version").append(c)
}

function displayPasswordGenerateButton() {
    $("#tr_element_before_generate_password").parent().append("<tr><td>" + PMA_messages.strGeneratePassword + '</td><td><input type="button" id="button_generate_password" value="' + PMA_messages.strGenerate + '" onclick="suggestPassword(this.form)" /><input type="text" name="generated_pw" id="generated_pw" /></td></tr>');
    $("#div_element_before_generate_password").parent().append('<div class="item"><label for="button_generate_password">' + PMA_messages.strGeneratePassword +
        ':</label><span class="options"><input type="button" id="button_generate_password" value="' + PMA_messages.strGenerate + '" onclick="suggestPassword(this.form)" /></span><input type="text" name="generated_pw" id="generated_pw" /></div>')
}

function PMA_addDatepicker(a, b) {
    var c = false;
    if (a.is(".datetimefield")) c = true;
    a.datetimepicker($.extend({
        showOn: "button",
        buttonImage: themeCalendarImage,
        buttonImageOnly: true,
        stepMinutes: 1,
        stepHours: 1,
        showSecond: true,
        showTimepicker: c,
        showButtonPanel: false,
        dateFormat: "yy-mm-dd",
        timeFormat: "hh:mm:ss",
        altFieldTimeOnly: false,
        showAnim: "",
        beforeShow: function () {
            a.data("comes_from", "datepicker");
            setTimeout(function () {
                $("#ui-timepicker-div").css("z-index", $("#ui-datepicker-div").css("z-index"))
            }, 0)
        }
    }, b))
}

function selectContent(a, b, c) {
    if (!(c && only_once_elements[a.name])) {
        only_once_elements[a.name] = true;
        b || a.select()
    }
}

function confirmLink(a, b) {
    if (PMA_messages.strDoYouReally == "" || typeof window.opera != "undefined") return true;
    var c = confirm(PMA_messages.strDoYouReally + " :\n" + b);
    if (c) if ($(a).hasClass("formLinkSubmit")) {
        var d = "is_js_confirmed";
        if ($(a).attr("href").indexOf("usesubform") != -1) d = "subform[" + $(a).attr("href").substr("#").match(/usesubform\[(\d+)\]/i)[1] + "][is_js_confirmed]";
        $(a).parents("form").append('<input type="hidden" name="' + d + '" value="1" />')
    } else if (typeof a.href != "undefined") a.href += "&is_js_confirmed=1";
    else if (typeof a.form != "undefined") a.form.action += "?is_js_confirmed=1";
    return c
}

function confirmQuery(a, b) {
    if (PMA_messages.strDoYouReally == "") return true;
    if (PMA_messages.strNoDropDatabases != "") if (/(^|;)\s*DROP\s+(IF EXISTS\s+)?DATABASE\s/i.test(b.value)) {
        alert(PMA_messages.strNoDropDatabases);
        a.reset();
        b.focus();
        return false
    }
    var c = /^\s*ALTER\s+TABLE\s+((`[^`]+`)|([A-Za-z0-9_$]+))\s+DROP\s/i, d = /^\s*DELETE\s+FROM\s/i,
        e = /^\s*TRUNCATE\s/i;
    if (/^\s*DROP\s+(IF EXISTS\s+)?(TABLE|DATABASE|PROCEDURE)\s/i.test(b.value) || c.test(b.value) || d.test(b.value) || e.test(b.value)) {
        c = b.value.length >
        100 ? b.value.substr(0, 100) + "\n    ..." : b.value;
        if (confirm(PMA_messages.strDoYouReally + " :\n" + c)) {
            a.elements.is_js_confirmed.value = 1;
            return true
        } else {
            window.focus();
            b.focus();
            return false
        }
    }
    return true
}

function confirmDisableRepository() {
    if (PMA_messages.strDoYouReally == "" || typeof window.opera != "undefined") return true;
    return confirm(PMA_messages.strBLOBRepositoryDisableStrongWarning + "\n" + PMA_messages.strBLOBRepositoryDisableAreYouSure)
}

function checkSqlQuery(a) {
    var b = a.elements.sql_query, c = /\s+/;
    if (typeof a.elements.sql_file != "undefined" && a.elements.sql_file.value.replace(c, "") != "") return true;
    if (typeof a.elements.sql_localfile != "undefined" && a.elements.sql_localfile.value.replace(c, "") != "") return true;
    if (typeof a.elements.id_bookmark != "undefined" && (a.elements.id_bookmark.value != null || a.elements.id_bookmark.value != "") && a.elements.id_bookmark.selectedIndex != 0) return true;
    if (b.value.replace(c, "") != "") return confirmQuery(a, b) ? true :
        false;
    a.reset();
    b.select();
    alert(PMA_messages.strFormEmpty);
    b.focus();
    return false
}

function emptyCheckTheField(a, b) {
    return a.elements[b].value.replace(/\s+/, "") == "" ? 1 : 0
}

function emptyFormElements(a, b) {
    return emptyCheckTheField(a, b)
}

function checkFormElementInRange(a, b, c, d, e) {
    a = a.elements[b];
    b = parseInt(a.value);
    if (typeof d == "undefined") d = 0;
    if (typeof e == "undefined") e = Number.MAX_VALUE;
    if (isNaN(b)) {
        a.select();
        alert(PMA_messages.strNotNumber);
        a.focus();
        return false
    } else if (b < d || b > e) {
        a.select();
        alert(c.replace("%d", b));
        a.focus();
        return false
    } else a.value = b;
    return true
}

function checkTableEditForm(a, b) {
    var c = 0, d, e, f, g;
    for (d = 0; d < b; d++) {
        e = "#field_" + d + "_2";
        e = $(e);
        g = e.val();
        if (g == "VARCHAR" || g == "CHAR" || g == "BIT" || g == "VARBINARY" || g == "BINARY") {
            e = $("#field_" + d + "_3");
            g = parseInt(e.val());
            f = $("#field_" + d + "_1");
            if (isNaN(g) && f.val() != "") {
                e.select();
                alert(PMA_messages.strNotNumber);
                e.focus();
                return false
            }
        }
        if (c == 0) {
            e = "field_" + d + "_1";
            emptyCheckTheField(a, e) || (c = 1)
        }
    }
    if (c == 0) {
        c = a.elements.field_0_1;
        alert(PMA_messages.strFormEmpty);
        c.focus();
        return false
    }
    if ($("input.textfield[name='table']").val() ==
        "") {
        alert(PMA_messages.strFormEmpty);
        $("input.textfield[name='table']").focus();
        return false
    }
    return true
}

$(document).ready(function () {
    $("table:not(.noclick) tr.odd:not(.noclick), table:not(.noclick) tr.even:not(.noclick)").live("click", function (a) {
        if (!$(a.target).is("a, img, a *")) {
            var b = $(this);
            if (!a.shiftKey || last_clicked_row == -1) {
                var c = b.find(":checkbox");
                if (c.length) {
                    var d = c.attr("checked");
                    if (!$(a.target).is(":checkbox, label")) {
                        d = !d;
                        c.attr("checked", d)
                    }
                    d ? b.addClass("marked") : b.removeClass("marked");
                    last_click_checked = d
                } else {
                    b.toggleClass("marked");
                    last_click_checked = false
                }
                last_clicked_row = last_click_checked ?
                    $("tr.odd:not(.noclick), tr.even:not(.noclick)").index(this) : -1;
                last_shift_clicked_row = -1
            } else {
                PMA_clearSelection();
                if (last_shift_clicked_row >= 0) {
                    if (last_shift_clicked_row >= last_clicked_row) {
                        a = last_clicked_row;
                        c = last_shift_clicked_row
                    } else {
                        a = last_shift_clicked_row;
                        c = last_clicked_row
                    }
                    b.parent().find("tr.odd:not(.noclick), tr.even:not(.noclick)").slice(a, c + 1).removeClass("marked").find(":checkbox").attr("checked", false)
                }
                d = $("tr.odd:not(.noclick), tr.even:not(.noclick)").index(this);
                if (d >= last_clicked_row) {
                    a =
                        last_clicked_row;
                    c = d
                } else {
                    a = d;
                    c = last_clicked_row
                }
                b.parent().find("tr.odd:not(.noclick), tr.even:not(.noclick)").slice(a, c + 1).addClass("marked").find(":checkbox").attr("checked", true);
                last_shift_clicked_row = d
            }
        }
    });
    $.timepicker != undefined && $(".datefield, .datetimefield").each(function () {
        PMA_addDatepicker($(this))
    })
});
var last_click_checked = false, last_clicked_row = -1, last_shift_clicked_row = -1, marked_row = [];

function markAllRows(a) {
    $("#" + a).find("input:checkbox:enabled").attr("checked", "checked").parents("tr").addClass("marked");
    return true
}

function unMarkAllRows(a) {
    $("#" + a).find("input:checkbox:enabled").removeAttr("checked").parents("tr").removeClass("marked");
    return true
}

function setCheckboxes(a, b) {
    b ? $("#" + a).find("input:checkbox").attr("checked", "checked") : $("#" + a).find("input:checkbox").removeAttr("checked");
    return true
}

function setSelectOptions(a, b, c) {
    $("form[name='" + a + "'] select[name='" + b + "']").find("option").attr("selected", c);
    return true
}

function setQuery(a) {
    if (codemirror_editor) codemirror_editor.setValue(a); else document.sqlform.sql_query.value = a
}

function insertQuery(a) {
    if (a == "clear") setQuery(""); else {
        var b = "", c = document.sqlform.dummy, d = document.sqlform.table.value;
        if (c.options.length > 0) {
            sql_box_locked = true;
            for (var e = "", f = "", g = "", h = 0, j = 0; j < c.options.length; j++) {
                h++;
                if (h > 1) {
                    e += ", ";
                    f += ",";
                    g += ","
                }
                e += c.options[j].value;
                f += "[value-" + h + "]";
                g += c.options[j].value + "=[value-" + h + "]"
            }
            if (a == "selectall") b = "SELECT * FROM `" + d + "` WHERE 1"; else if (a == "select") b = "SELECT " + e + " FROM `" + d + "` WHERE 1"; else if (a == "insert") b = "INSERT INTO `" + d + "`(" + e + ") VALUES (" +
                f + ")"; else if (a == "update") b = "UPDATE `" + d + "` SET " + g + " WHERE 1"; else if (a == "delete") b = "DELETE FROM `" + d + "` WHERE 1";
            setQuery(b);
            sql_box_locked = false
        }
    }
}

function insertValueQuery() {
    var a = document.sqlform.sql_query, b = document.sqlform.dummy;
    if (b.options.length > 0) {
        sql_box_locked = true;
        for (var c = "", d = 0, e = 0; e < b.options.length; e++) if (b.options[e].selected) {
            d++;
            if (d > 1) c += ", ";
            c += b.options[e].value
        }
        if (codemirror_editor) codemirror_editor.replaceSelection(c); else if (document.selection) {
            a.focus();
            sel = document.selection.createRange();
            sel.text = c;
            document.sqlform.insert.focus()
        } else if (document.sqlform.sql_query.selectionStart || document.sqlform.sql_query.selectionStart ==
            "0") {
            b = document.sqlform.sql_query.selectionEnd;
            d = document.sqlform.sql_query.value;
            a.value = d.substring(0, document.sqlform.sql_query.selectionStart) + c + d.substring(b, d.length)
        } else a.value += c;
        sql_box_locked = false
    }
}

function goToUrl(a, b) {
    eval("document.location.href = '" + b + "pos=" + a.options[a.selectedIndex].value + "'")
}

function refreshDragOption(a) {
    if ($("#" + a).css("visibility") == "visible") {
        refreshLayout();
        TableDragInit()
    }
}

function refreshLayout() {
    var a = $("#pdflayout"), b = $("#orientation_opt").val(),
        c = $("#paper_opt").length == 1 ? $("#paper_opt").val() : "A4";
    if (b == "P") {
        posa = "x";
        posb = "y"
    } else {
        posa = "y";
        posb = "x"
    }
    a.css("width", pdfPaperSize(c, posa) + "px");
    a.css("height", pdfPaperSize(c, posb) + "px")
}

function ToggleDragDrop(a) {
    a = $("#" + a);
    if (a.css("visibility") == "hidden") {
        PDFinit();
        a.css("visibility", "visible");
        a.css("display", "block");
        $("#showwysiwyg").val("1")
    } else {
        a.css("visibility", "hidden");
        a.css("display", "none");
        $("#showwysiwyg").val("0")
    }
}

function dragPlace(a, b, c) {
    a = $("#table_" + a);
    b == "x" ? a.css("left", c + "px") : a.css("top", c + "px")
}

function pdfPaperSize(a, b) {
    switch (a.toUpperCase()) {
        case "4A0":
            return b == "x" ? 4767.87 : 6740.79;
        case "2A0":
            return b == "x" ? 3370.39 : 4767.87;
        case "A0":
            return b == "x" ? 2383.94 : 3370.39;
        case "A1":
            return b == "x" ? 1683.78 : 2383.94;
        case "A2":
            return b == "x" ? 1190.55 : 1683.78;
        case "A3":
            return b == "x" ? 841.89 : 1190.55;
        case "A4":
            return b == "x" ? 595.28 : 841.89;
        case "A5":
            return b == "x" ? 419.53 : 595.28;
        case "A6":
            return b == "x" ? 297.64 : 419.53;
        case "A7":
            return b == "x" ? 209.76 : 297.64;
        case "A8":
            return b == "x" ? 147.4 : 209.76;
        case "A9":
            return b ==
            "x" ? 104.88 : 147.4;
        case "A10":
            return b == "x" ? 73.7 : 104.88;
        case "B0":
            return b == "x" ? 2834.65 : 4008.19;
        case "B1":
            return b == "x" ? 2004.09 : 2834.65;
        case "B2":
            return b == "x" ? 1417.32 : 2004.09;
        case "B3":
            return b == "x" ? 1000.63 : 1417.32;
        case "B4":
            return b == "x" ? 708.66 : 1000.63;
        case "B5":
            return b == "x" ? 498.9 : 708.66;
        case "B6":
            return b == "x" ? 354.33 : 498.9;
        case "B7":
            return b == "x" ? 249.45 : 354.33;
        case "B8":
            return b == "x" ? 175.75 : 249.45;
        case "B9":
            return b == "x" ? 124.72 : 175.75;
        case "B10":
            return b == "x" ? 87.87 : 124.72;
        case "C0":
            return b == "x" ?
                2599.37 : 3676.54;
        case "C1":
            return b == "x" ? 1836.85 : 2599.37;
        case "C2":
            return b == "x" ? 1298.27 : 1836.85;
        case "C3":
            return b == "x" ? 918.43 : 1298.27;
        case "C4":
            return b == "x" ? 649.13 : 918.43;
        case "C5":
            return b == "x" ? 459.21 : 649.13;
        case "C6":
            return b == "x" ? 323.15 : 459.21;
        case "C7":
            return b == "x" ? 229.61 : 323.15;
        case "C8":
            return b == "x" ? 161.57 : 229.61;
        case "C9":
            return b == "x" ? 113.39 : 161.57;
        case "C10":
            return b == "x" ? 79.37 : 113.39;
        case "RA0":
            return b == "x" ? 2437.8 : 3458.27;
        case "RA1":
            return b == "x" ? 1729.13 : 2437.8;
        case "RA2":
            return b ==
            "x" ? 1218.9 : 1729.13;
        case "RA3":
            return b == "x" ? 864.57 : 1218.9;
        case "RA4":
            return b == "x" ? 609.45 : 864.57;
        case "SRA0":
            return b == "x" ? 2551.18 : 3628.35;
        case "SRA1":
            return b == "x" ? 1814.17 : 2551.18;
        case "SRA2":
            return b == "x" ? 1275.59 : 1814.17;
        case "SRA3":
            return b == "x" ? 907.09 : 1275.59;
        case "SRA4":
            return b == "x" ? 637.8 : 907.09;
        case "LETTER":
            return b == "x" ? 612 : 792;
        case "LEGAL":
            return b == "x" ? 612 : 1008;
        case "EXECUTIVE":
            return b == "x" ? 521.86 : 756;
        case "FOLIO":
            return b == "x" ? 612 : 936
    }
    return 0
}

function popupBSMedia(a, b, c, d, e, f) {
    if (e == undefined) e = 640;
    if (f == undefined) f = 480;
    window.open("bs_play_media.php?" + a + "&bs_reference=" + b + "&media_type=" + c + "&custom_type=" + d, "viewBSMedia", "width=" + e + ", height=" + f + ", resizable=1, scrollbars=1, status=0")
}

function requestMIMETypeChange(a, b, c, d) {
    if (undefined == d) d = "";
    var e = prompt("Enter custom MIME type", d);
    e && e != d && changeMIMEType(a, b, c, e)
}

function changeMIMEType(a, b, c, d) {
    jQuery.post("bs_change_mime_type.php", {bs_db: a, bs_table: b, bs_reference: c, bs_new_mime_type: d})
}

$(document).ready(function () {
    $(".inline_edit_sql").live("click", function () {
        if ($("#sql_query_edit").length) return false;
        var a = $(this).prev(), b = a.find("input[name='sql_query']").val(),
            c = $(this).parent().prev().find(".inner_sql"), d = c.html();
        b = '<textarea name="sql_query_edit" id="sql_query_edit">' + b + "</textarea>\n";
        b += '<input type="button" class="btnSave" value="' + PMA_messages.strGo + '">\n';
        b += '<input type="button" class="btnDiscard" value="' + PMA_messages.strCancel + '">\n';
        c.replaceWith(b);
        c = $("#sql_query_edit").css("height");
        codemirror_editor = CodeMirror.fromTextArea($('textarea[name="sql_query_edit"]')[0], {
            lineNumbers: true,
            matchBrackets: true,
            indentUnit: 4,
            mode: "text/x-mysql",
            lineWrapping: true
        });
        codemirror_editor.getScrollerElement().style.height = c;
        codemirror_editor.refresh();
        $(".btnSave").click(function () {
            var e = codemirror_editor !== undefined ? codemirror_editor.getValue() : $(this).prev().val();
            $("<form>", {
                action: "import.php",
                method: "post"
            }).append(a.find("input[name=server], input[name=db], input[name=table], input[name=token]").clone()).append($("<input>",
                {type: "hidden", name: "show_query", value: 1})).append($("<input>", {
                type: "hidden",
                name: "sql_query",
                value: e
            })).appendTo($("body")).submit()
        });
        $(".btnDiscard").click(function () {
            $(this).closest(".sql").html('<span class="syntax"><span class="inner_sql">' + d + "</span></span>")
        });
        return false
    });
    $(".sqlbutton").click(function (a) {
        insertQuery(a.target.id);
        return false
    });
    $("#export_type").change(function () {
        if ($("#export_type").val() == "svg") {
            $("#show_grid_opt").attr("disabled", "disabled");
            $("#orientation_opt").attr("disabled",
                "disabled");
            $("#with_doc").attr("disabled", "disabled");
            $("#show_table_dim_opt").removeAttr("disabled");
            $("#all_table_same_wide").removeAttr("disabled");
            $("#paper_opt").removeAttr("disabled", "disabled");
            $("#show_color_opt").removeAttr("disabled", "disabled")
        } else if ($("#export_type").val() == "dia") {
            $("#show_grid_opt").attr("disabled", "disabled");
            $("#with_doc").attr("disabled", "disabled");
            $("#show_table_dim_opt").attr("disabled", "disabled");
            $("#all_table_same_wide").attr("disabled", "disabled");
            $("#paper_opt").removeAttr("disabled",
                "disabled");
            $("#show_color_opt").removeAttr("disabled", "disabled");
            $("#orientation_opt").removeAttr("disabled", "disabled")
        } else if ($("#export_type").val() == "eps") {
            $("#show_grid_opt").attr("disabled", "disabled");
            $("#orientation_opt").removeAttr("disabled");
            $("#with_doc").attr("disabled", "disabled");
            $("#show_table_dim_opt").attr("disabled", "disabled");
            $("#all_table_same_wide").attr("disabled", "disabled");
            $("#paper_opt").attr("disabled", "disabled");
            $("#show_color_opt").attr("disabled", "disabled")
        } else if ($("#export_type").val() ==
            "pdf") {
            $("#show_grid_opt").removeAttr("disabled");
            $("#orientation_opt").removeAttr("disabled");
            $("#with_doc").removeAttr("disabled", "disabled");
            $("#show_table_dim_opt").removeAttr("disabled", "disabled");
            $("#all_table_same_wide").removeAttr("disabled", "disabled");
            $("#paper_opt").removeAttr("disabled", "disabled");
            $("#show_color_opt").removeAttr("disabled", "disabled")
        }
    });
    $("#sqlquery").focus().keydown(function (a) {
        a.ctrlKey && a.keyCode == 13 && $("#sqlqueryform").submit()
    });
    if ($("#input_username")) $("#input_username").val() ==
    "" ? $("#input_username").focus() : $("#input_password").focus()
});

function PMA_ajaxShowMessage(a, b) {
    var c = true, d = true;
    if (a == "") return true; else if (a) {
        if (a == PMA_messages.strProcessingRequest) c = d = false
    } else {
        a = PMA_messages.strLoading;
        c = d = false
    }
    if (b == undefined) b = 5E3; else if (b === false) c = false;
    $("#loading_parent").length == 0 && $('<div id="loading_parent"></div>').prependTo("body");
    ajax_message_count++;
    $(".ajax_notification[id^=ajax_message_num]").remove();
    var e = $('<span class="ajax_notification" id="ajax_message_num_' + ajax_message_count + '"></span>').hide().appendTo("#loading_parent").html(a).fadeIn("medium");
    c && e.delay(b).fadeOut("medium", function () {
        $(this).is(".dismissable") && $(this).qtip("hide");
        $(this).remove()
    });
    if (d) {
        e.addClass("dismissable").css("cursor", "pointer");
        PMA_createqTip(e, PMA_messages.strDismiss, {
            show: {effect: {length: 0}, delay: 0},
            hide: {effect: {length: 0}, delay: 0}
        })
    }
    return e
}

function PMA_ajaxRemoveMessage(a) {
    if (a != undefined && a instanceof jQuery) {
        a.stop(true, true).fadeOut("medium");
        a.is(".dismissable") ? a.qtip("hide") : a.remove()
    }
}

$(document).ready(function () {
    $(".ajax_notification.dismissable").live("click", function () {
        PMA_ajaxRemoveMessage($(this))
    });
    $(".ajax_notification a, .ajax_notification button, .ajax_notification input").live("mouseover", function () {
        $(this).parents(".ajax_notification").qtip("hide")
    });
    $(".ajax_notification a, .ajax_notification button, .ajax_notification input").live("mouseout", function () {
        $(this).parents(".ajax_notification").qtip("show")
    })
});

function PMA_showNoticeForEnum(a) {
    var b = a.attr("id").split("_")[1];
    b += "_" + (parseInt(a.attr("id").split("_")[2]) + 1);
    a = a.val();
    a == "ENUM" || a == "SET" ? $("p[id='enum_notice_" + b + "']").show() : $("p[id='enum_notice_" + b + "']").hide()
}

function PMA_createTableDialog(a, b, c) {
    var d = {};
    d[PMA_messages.strCancel] = function () {
        $(this).closest(".ui-dialog-content").dialog("close").remove()
    };
    var e = {};
    e[PMA_messages.strOK] = function () {
        $(this).closest(".ui-dialog-content").dialog("close").remove()
    };
    var f = PMA_ajaxShowMessage();
    $.get(c, b, function (g) {
        if (g.success != undefined && g.success == false) a.append(g.error).dialog({
            height: 230,
            width: 900,
            open: PMA_verifyColumnsProperties,
            buttons: e
        }).find("fieldset").remove(); else {
            var h = getWindowSize(), j;
            a.append(g).dialog({
                dialogClass: "create-table",
                resizable: false,
                draggable: false,
                modal: true,
                stack: false,
                position: ["left", "top"],
                width: h.width - 10,
                height: h.height - 10,
                open: function () {
                    var k = $(this).attr("id");
                    $(window).bind("resize.dialog-resizer", function () {
                        clearTimeout(j);
                        j = setTimeout(function () {
                            var o = getWindowSize();
                            $("#" + k).dialog("option", {width: o.width - 10, height: o.height - 10})
                        }, 50)
                    });
                    var n = $("<div>", {id: "content-hide"}).hide();
                    $("body > *:not(.ui-dialog)").wrapAll(n);
                    $(this).scrollTop(0).closest(".ui-dialog").css({left: 0, top: 0});
                    PMA_verifyColumnsProperties();
                    n = $(".ui-dialog-buttonpane");
                    var l = n.find(".ui-button"), m = $("#create_table_form").find("input[name='do_save_data']");
                    l.insertAfter(m);
                    n.hide()
                },
                close: function () {
                    $(window).unbind("resize.dialog-resizer");
                    $("#content-hide > *").unwrap();
                    menuResize();
                    menuResize()
                },
                buttons: d
            })
        }
        PMA_convertFootnotesToTooltips(a);
        PMA_ajaxRemoveMessage(f)
    })
}

function PMA_createChart(a) {
    var b = a.chart.renderTo, c = {
        chart: {
            type: "spline", marginRight: 10, backgroundColor: "none", events: {
                load: function () {
                    var d = this, e = null, f = null, g = 0, h;
                    if (!(d.options.chart.forExport == true || !d.options.realtime || !d.options.realtime.callback || !server_time_diff)) {
                        d.options.realtime.timeoutCallBack = function () {
                            d.options.realtime.postRequest = $.post(d.options.realtime.url, d.options.realtime.postData, function (j) {
                                try {
                                    f = jQuery.parseJSON(j)
                                } catch (k) {
                                    d.options.realtime.error && d.options.realtime.error(k);
                                    return
                                }
                                h = e == null ? f.x - d.xAxis[0].getExtremes().max : parseInt(f.x - e.x);
                                d.xAxis[0].setExtremes(d.xAxis[0].getExtremes().min + h, d.xAxis[0].getExtremes().max + h, false);
                                d.options.realtime.callback(d, f, e, g);
                                e = f;
                                g++;
                                if (chart_activeTimeouts[b] != null) chart_activeTimeouts[b] = setTimeout(d.options.realtime.timeoutCallBack, d.options.realtime.refreshRate)
                            })
                        };
                        chart_activeTimeouts[b] = setTimeout(d.options.realtime.timeoutCallBack, 5)
                    }
                }
            }
        },
        plotOptions: {series: {marker: {radius: 3}}},
        credits: {enabled: false},
        xAxis: {type: "datetime"},
        yAxis: {min: 0, title: {text: PMA_messages.strTotalCount}, plotLines: [{value: 0, width: 1, color: "#808080"}]},
        tooltip: {
            formatter: function () {
                return "<b>" + this.series.name + "</b><br/>" + Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.x) + "<br/>" + Highcharts.numberFormat(this.y, 2)
            }
        },
        exporting: {enabled: true},
        series: []
    };
    if (a.realtime) {
        if (!a.realtime.refreshRate) a.realtime.refreshRate = 5E3;
        if (!a.realtime.numMaxPoints) a.realtime.numMaxPoints = 30;
        a.realtime.postData = $.extend(false, {ajax_request: true, chart_data: 1, type: a.realtime.type},
            a.realtime.postData);
        if (server_time_diff) {
            c.xAxis.min = (new Date).getTime() - server_time_diff - a.realtime.numMaxPoints * a.realtime.refreshRate;
            c.xAxis.max = (new Date).getTime() - server_time_diff + a.realtime.refreshRate
        }
    }
    $.extend(true, c, a);
    return new Highcharts.Chart(c)
}

function PMA_createProfilingChart(a, b) {
    return PMA_createChart($.extend(true, {
        chart: {renderTo: "profilingchart", type: "pie"},
        title: {text: "", margin: 0},
        series: [{type: "pie", name: PMA_messages.strQueryExecutionTime, data: a}],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true, distance: 35, formatter: function () {
                        return "<b>" + this.point.name + "</b><br/>" + Highcharts.numberFormat(this.percentage, 2) + " %"
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return "<b>" + this.point.name + "</b><br/>" + PMA_prettyProfilingNum(this.y) +
                    "<br/>(" + Highcharts.numberFormat(this.percentage, 2) + " %)"
            }
        }
    }, b))
}

function PMA_prettyProfilingNum(a, b) {
    b || (b = 2);
    b = Math.pow(10, b);
    a = a * 1E3 < 0.1 ? Math.round(b * a * 1E3 * 1E3) / b + "\u00b5" : a < 0.1 ? Math.round(b * a * 1E3) / b + "m" : Math.round(b * a) / b;
    return a + "s"
}

function PMA_SQLPrettyPrint(a) {
    for (var b = CodeMirror.getMode({}, "text/x-mysql"), c = new CodeMirror.StringStream(a), d = b.startState(), e, f = [], g = "", h = function (o) {
        for (var p = "", q = 0; q < 4 * o; q++) p += " ";
        return p
    }, j = {
        select: ["select", "from", "on", "where", "having", "limit", "order by", "group by"],
        update: ["update", "set", "where"],
        "insert into": ["insert into", "values"]
    }, k = {";": true, ",": true, ".": true, "(": true}, n = {".": true}; !c.eol();) {
        c.start = c.pos;
        e = b.token(c, d);
        e != null && f.push([e, c.current().toLowerCase()])
    }
    b = f[0][1];
    if (!j[b]) return a;
    a = [];
    var l, m;
    c = 0;
    d = j[b][0];
    a.unshift("statement");
    for (e = 0; e < f.length; e++) {
        if (f[e][1] == "(") if (e < f.length - 1 && f[e + 1][0] == "statement-verb") a.unshift(l = "statement"); else e > 0 && f[e - 1][0] == "builtin" ? a.unshift(l = "function") : a.unshift(l = "generic"); else l = null;
        if (f[e][1] == ")") {
            m = a[0];
            a.shift()
        } else m = null;
        if (e > 0 && l == "statement") {
            c++;
            g += "\n" + h(c) + f[e][1] + " " + f[e + 1][1].toUpperCase() + "\n" + h(c + 1);
            b = f[e + 1][1];
            e++
        } else {
            if (m == "statement" && c > 0) {
                g += "\n" + h(c);
                c--
            }
            m = j[b].indexOf(f[e][1]);
            if (m != -1) {
                if (e >
                    0) g += "\n";
                g += h(c) + f[e][1].toUpperCase();
                g += "\n" + h(c + 1);
                d = f[e][1]
            } else {
                if (!k[f[e][1]] && !(e > 0 && n[f[e - 1][1]]) && g.charAt(g.length - 1) != " ") g += " ";
                g += f[e][0] == "keyword" ? f[e][1].toUpperCase() : f[e][1]
            }
            if ((d == "select" || d == "where" || d == "set") && f[e][1] == "," && a[0] == "statement") g += "\n" + h(c + 1);
            if (d == "where" && (f[e][1] == "and" || f[e][1] == "or" || f[e][1] == "xor")) if (a[0] == "statement") g += "\n" + h(c + 1)
        }
    }
    return g
}

jQuery.fn.PMA_confirm = function (a, b, c) {
    if (PMA_messages.strDoYouReally == "") return true;
    var d = {};
    d[PMA_messages.strOK] = function () {
        $(this).dialog("close").remove();
        $.isFunction(c) && c.call(this, b)
    };
    d[PMA_messages.strCancel] = function () {
        $(this).dialog("close").remove()
    };
    $('<div id="confirm_dialog"></div>').prepend(a).dialog({buttons: d})
};
jQuery.fn.PMA_sort_table = function (a) {
    return this.each(function () {
        var b = $(this), c = $(this).find("tr").get();
        $.each(c, function (d, e) {
            e.sortKey = $.trim($(e).find(a).text().toLowerCase())
        });
        c.sort(function (d, e) {
            if (d.sortKey < e.sortKey) return -1;
            if (d.sortKey > e.sortKey) return 1;
            return 0
        });
        $.each(c, function (d, e) {
            $(b).append(e);
            e.sortKey = null
        });
        $(this).find("tr:odd").removeClass("even").addClass("odd").end().find("tr:even").removeClass("odd").addClass("even")
    })
};
$(document).ready(function () {
        $("#create_table_form_minimal.ajax").live("submit", function (a) {
            a.preventDefault();
            $form = $(this);
            PMA_prepareForAjaxRequest($form);
            a = $form.serialize();
            var b = $form.attr("action"), c = $('<div id="create_table_dialog"></div>');
            PMA_createTableDialog(c, a, b);
            $form.find("input[name=table],input[name=num_fields]").val("")
        });
        $("#create_table_form input[name=do_save_data]").live("click", function (a) {
            a.preventDefault();
            a = $("#create_table_form");
            if (checkTableEditForm(a[0], a.find("input[name=orig_num_fields]").val())) if (a.hasClass("ajax")) {
                PMA_ajaxShowMessage(PMA_messages.strProcessingRequest);
                PMA_prepareForAjaxRequest(a);
                $.post(a.attr("action"), a.serialize() + "&do_save_data=" + $(this).val(), function (b) {
                    if (b.success == true) {
                        $("#properties_message").removeClass("error").html("");
                        PMA_ajaxShowMessage(b.message);
                        $("#create_table_dialog").length > 0 && $("#create_table_dialog").dialog("close").remove();
                        var c = $("#tablesForm").find("tbody").not("#tbl_summary_row");
                        if (c.length == 0) window.parent && window.parent.frame_content && window.parent.frame_content.location.reload(); else {
                            var d = $(c).find("tr:last");
                            d = $(d).find("input:checkbox").attr("id").match(/\d+/)[0];
                            d = "checkbox_tbl_" + (parseFloat(d) + 1);
                            b.new_table_string = b.new_table_string.replace(/checkbox_tbl_/, d);
                            $(b.new_table_string).appendTo(c);
                            $(c).PMA_sort_table("th");
                            PMA_adjustTotals()
                        }
                        window.parent && window.parent.frame_navigation && window.parent.frame_navigation.location.reload()
                    } else {
                        $("#properties_message").addClass("error").html(b.error);
                        $("#properties_message")[0].scrollIntoView()
                    }
                })
            } else {
                a.append('<input type="hidden" name="do_save_data" value="save" />');
                a.submit()
            }
        });
        $("#create_table_form.ajax input[name=submit_num_fields]").live("click", function (a) {
            a.preventDefault();
            a = $("#create_table_form");
            var b = PMA_ajaxShowMessage(PMA_messages.strProcessingRequest);
            PMA_prepareForAjaxRequest(a);
            $.post(a.attr("action"), a.serialize() + "&submit_num_fields=" + $(this).val(), function (c) {
                $("#create_table_dialog").length > 0 && $("#create_table_dialog").html(c);
                $("#create_table_div").length > 0 && $("#create_table_div").html(c);
                PMA_verifyColumnsProperties();
                PMA_ajaxRemoveMessage(b)
            })
        })
    },
    "top.frame_content");
$(document).ready(function () {
    $("#alterTableOrderby.ajax").live("submit", function (a) {
        a.preventDefault();
        a = $(this);
        PMA_prepareForAjaxRequest(a);
        $.post(a.attr("action"), a.serialize() + "&submitorderby=Go", function (b) {
            $("#sqlqueryresults").length != 0 && $("#sqlqueryresults").remove();
            $("#result_query").length != 0 && $("#result_query").remove();
            if (b.success == true) {
                PMA_ajaxShowMessage(b.message);
                $("<div id='sqlqueryresults'></div>").insertAfter("#floating_menubar");
                $("#sqlqueryresults").html(b.sql_query);
                $("#result_query .notice").remove();
                $("#result_query").prepend(b.message)
            } else {
                var c = $("<div id='temp_div'></div>");
                c.html(b.error);
                b = c.find("code").addClass("error");
                PMA_ajaxShowMessage(b, false)
            }
        })
    });
    $("#copyTable.ajax input[name='submit_copy']").live("click", function (a) {
        a.preventDefault();
        a = $("#copyTable");
        if (a.find("input[name='switch_to_new']").attr("checked")) {
            a.append('<input type="hidden" name="submit_copy" value="Go" />');
            a.removeClass("ajax");
            a.find("#ajax_request_hidden").remove();
            a.submit()
        } else {
            PMA_prepareForAjaxRequest(a);
            $.post(a.attr("action"), a.serialize() + "&submit_copy=Go", function (b) {
                $("#sqlqueryresults").length != 0 && $("#sqlqueryresults").remove();
                $("#result_query").length != 0 && $("#result_query").remove();
                if (b.success == true) {
                    PMA_ajaxShowMessage(b.message);
                    $("<div id='sqlqueryresults'></div>").insertAfter("#floating_menubar");
                    $("#sqlqueryresults").html(b.sql_query);
                    $("#result_query .notice").remove();
                    $("#result_query").prepend(b.message);
                    $("#copyTable").find("select[name='target_db'] option").filterByValue(b.db).attr("selected",
                        "selected");
                    window.parent && window.parent.frame_navigation && window.parent.frame_navigation.location.reload()
                } else {
                    var c = $("<div id='temp_div'></div>");
                    c.html(b.error);
                    b = c.find("code").addClass("error");
                    PMA_ajaxShowMessage(b, false)
                }
            })
        }
    });
    $("#tbl_maintenance.ajax li a.maintain_action").live("click", function (a) {
        a.preventDefault();
        a = $(this).attr("href");
        a = a.split("?");
        $("#sqlqueryresults").length != 0 && $("#sqlqueryresults").remove();
        $("#result_query").length != 0 && $("#result_query").remove();
        $.post(a[0], a[1] +
            "&ajax_request=true", function (b) {
            if (b.success == undefined) {
                var c = $("<div id='temp_div'></div>");
                c.html(b);
                c = c.find("#result_query .success");
                PMA_ajaxShowMessage(c);
                $("<div id='sqlqueryresults' class='ajax'></div>").insertAfter("#floating_menubar");
                $("#sqlqueryresults").html(b);
                PMA_init_slider();
                $("#sqlqueryresults").children("fieldset").remove()
            } else if (b.success == true) {
                PMA_ajaxShowMessage(b.message);
                $("<div id='sqlqueryresults' class='ajax'></div>").insertAfter("#floating_menubar");
                $("#sqlqueryresults").html(b.sql_query)
            } else {
                c =
                    $("<div id='temp_div'></div>");
                c.html(b.error);
                b = c.find("code").addClass("error");
                PMA_ajaxShowMessage(b, false)
            }
        })
    })
}, "top.frame_content");
$(document).ready(function () {
    $("#drop_db_anchor").live("click", function (a) {
        a.preventDefault();
        a = PMA_messages.strDropDatabaseStrongWarning + "\n" + PMA_messages.strDoYouReally + " :\nDROP DATABASE " + escapeHtml(window.parent.db);
        $(this).PMA_confirm(a, $(this).attr("href"), function (b) {
            PMA_ajaxShowMessage(PMA_messages.strProcessingRequest);
            $.get(b, {is_js_confirmed: "1", ajax_request: true}, function () {
                window.parent.refreshNavigation();
                window.parent.refreshMain()
            })
        })
    })
});
$(document).ready(function () {
    $("#create_database_form.ajax").live("submit", function (a) {
        a.preventDefault();
        $form = $(this);
        PMA_ajaxShowMessage(PMA_messages.strProcessingRequest);
        PMA_prepareForAjaxRequest($form);
        $.post($form.attr("action"), $form.serialize(), function (b) {
            if (b.success == true) {
                PMA_ajaxShowMessage(b.message);
                $("#tabledatabases").find("tbody").append(b.new_db_string).PMA_sort_table(".name").find("#db_summary_row").appendTo("#tabledatabases tbody").removeClass("odd even");
                b = $("#databases_count");
                var c = parseInt(b.text());
                b.text(++c);
                window.parent && window.parent.frame_navigation && window.parent.frame_navigation.location.reload()
            } else PMA_ajaxShowMessage(b.error, false)
        })
    })
});
$(document).ready(function () {
    $("#change_password_anchor.dialog_active").live("click", function (a) {
        a.preventDefault();
        return false
    });
    $("#change_password_anchor.ajax").live("click", function (a) {
        a.preventDefault();
        $(this).removeClass("ajax").addClass("dialog_active");
        var b = {};
        b[PMA_messages.strCancel] = function () {
            $(this).dialog("close").remove()
        };
        $.get($(this).attr("href"), {ajax_request: true}, function (c) {
            $('<div id="change_password_dialog"></div>').dialog({
                title: PMA_messages.strChangePassword, width: 600,
                close: function () {
                    $(this).remove()
                }, buttons: b, beforeClose: function () {
                    $("#change_password_anchor.dialog_active").removeClass("dialog_active").addClass("ajax")
                }
            }).append(c);
            displayPasswordGenerateButton()
        })
    });
    $("#change_password_form.ajax").find("input[name=change_pw]").live("click", function (a) {
        a.preventDefault();
        a = $("#change_password_form");
        var b = $(this).val(), c = PMA_ajaxShowMessage(PMA_messages.strProcessingRequest);
        $(a).append('<input type="hidden" name="ajax_request" value="true" />');
        $.post($(a).attr("action"),
            $(a).serialize() + "&change_pw=" + b, function (d) {
                if (d.success == true) {
                    $("#floating_menubar").after(d.sql_query);
                    $("#change_password_dialog").hide().remove();
                    $("#edit_user_dialog").dialog("close").remove();
                    $("#change_password_anchor.dialog_active").removeClass("dialog_active").addClass("ajax");
                    PMA_ajaxRemoveMessage(c)
                } else PMA_ajaxShowMessage(d.error, false)
            })
    })
});
$(document).ready(function () {
    PMA_verifyColumnsProperties();
    $("select[class='column_type']").live("change", function () {
        PMA_showNoticeForEnum($(this))
    });
    $(".default_type").live("change", function () {
        PMA_hideShowDefaultValue($(this))
    })
});

function PMA_verifyColumnsProperties() {
    $("select[class='column_type']").each(function () {
        PMA_showNoticeForEnum($(this))
    });
    $(".default_type").each(function () {
        PMA_hideShowDefaultValue($(this))
    })
}

function PMA_hideShowDefaultValue(a) {
    a.val() == "USER_DEFINED" ? a.siblings(".default_value").show().focus() : a.siblings(".default_value").hide()
}

var $enum_editor_dialog = null;
$(document).ready(function () {
    $("a.open_enum_editor").live("click", function () {
        var a = $(this).closest("tr").find("input:first").val();
        a = a.length < 1 ? PMA_messages.enum_newColumnVals : PMA_messages.enum_columnVals.replace(/%s/, '"' + decodeURIComponent(a) + '"');
        var b = $(this).closest("td").find("input").val();
        b = $("<div/>").text(b).html();
        for (var c = [], d = false, e, f, g = "", h = 0; h < b.length; h++) {
            e = b.charAt(h);
            f = h == b.length ? "" : b.charAt(h + 1);
            if (!d && e == "'") d = true; else if (d && e == "\\" && f == "\\") {
                g += "&#92;";
                h++
            } else if (d && f == "'" &&
                (e == "'" || e == "\\")) {
                g += "&#39;";
                h++
            } else if (d && e == "'") {
                d = false;
                c.push(g);
                g = ""
            } else if (d) g += e
        }
        g.length > 0 && c.push(g);
        b = "";
        c.length == 0 && c.push("", "", "", "");
        d = PMA_getImage("b_drop.png");
        for (h = 0; h < c.length; h++) b += "<tr><td><input type='text' value='" + c[h] + "'/></td><td class='drop'>" + d + "</td></tr>";
        a = "<div id='enum_editor'><fieldset><legend>" + a + "</legend><p>" + PMA_getImage("s_notice.png") + PMA_messages.enum_hint + "</p><table class='values'>" + b + "</table></fieldset><fieldset class='tblFooters'><table class='add'><tr><td><div class='slider'></div></td><td><form><div><input type='submit' class='add_value' value='" +
            PMA_messages.enum_addValue.replace(/%d/, 1) + "'/></div></form></td></tr></table><input type='hidden' value='" + $(this).closest("td").find("input").attr("id") + "' /></fieldset>";
        c = {};
        c[PMA_messages.strGo] = function () {
            var j = [];
            $(this).find(".values input").each(function (n, l) {
                var m = l.value.replace(/\\/g, "\\\\").replace(/'/g, "''");
                j.push("'" + m + "'")
            });
            var k = $(this).find("input[type='hidden']").attr("value");
            $("input[id='" + k + "']").attr("value", j.join(","));
            $(this).dialog("close")
        };
        c[PMA_messages.strClose] = function () {
            $(this).dialog("close")
        };
        (h = parseInt(parseInt($("html").css("font-size"), 10) / 13 * 340, 10)) || (h = 340);
        $enum_editor_dialog = $(a).dialog({
            minWidth: h,
            modal: true,
            title: PMA_messages.enum_editor,
            buttons: c,
            open: function () {
                $(this).closest(".ui-dialog").find(".ui-dialog-buttonpane button:first").focus()
            },
            close: function () {
                $(this).remove()
            }
        });
        $enum_editor_dialog.find(".slider").slider({
            animate: true, range: "min", value: 1, min: 1, max: 9, slide: function (j, k) {
                $(this).closest("table").find("input[type=submit]").val(PMA_messages.enum_addValue.replace(/%d/,
                    k.value))
            }
        });
        $(".ui-slider-handle").addClass("ui-state-focus");
        return false
    });
    $("input.add_value").live("click", function (a) {
        a.preventDefault();
        for (a = $enum_editor_dialog.find("div.slider").slider("value"); a--;) $enum_editor_dialog.find(".values").append("<tr style='display: none;'><td><input type='text' /></td><td class='drop'>" + PMA_getImage("b_drop.png") + "</td></tr>").find("tr:last").show("fast")
    });
    $("#enum_editor td.drop").live("click", function () {
        $(this).closest("tr").hide("fast", function () {
            $(this).remove()
        })
    })
});
$(document).ready(function () {
    PMA_convertFootnotesToTooltips()
});

function checkIndexName(a) {
    if ($("#" + a).length == 0) return false;
    a = $("#input_index_name");
    if ($("#select_index_type").find("option:selected").attr("value") == "PRIMARY") {
        a.attr("value", "PRIMARY");
        a.attr("disabled", true)
    } else {
        a.attr("value") == "PRIMARY" && a.attr("value", "");
        a.attr("disabled", false)
    }
    return true
}

function PMA_convertFootnotesToTooltips(a) {
    if (a == undefined || !a instanceof jQuery || a.length == 0) a = $("body");
    $footnotes = a.find(".footnotes");
    $footnotes.hide();
    $footnotes.find("span").each(function () {
        $(this).children("sup").remove()
    });
    $footnotes.css("border", "none");
    $footnotes.css("padding", "0px");
    a.find("sup.footnotemarker").hide();
    a.find("img.footnotemarker").show();
    a.find("img.footnotemarker").each(function () {
        var b = $(this).attr("class");
        b = b.split(" ");
        for (i = 0; i < b.length; i++) if (b[i].split("_")[0] ==
            "footnote") var c = b[i].split("_")[1];
        b = $footnotes.find("span[id='footnote_" + c + "']").html();
        $(this).qtip({content: b, show: {delay: 0}, hide: {delay: 1E3}, style: {background: "#ffffcc"}})
    })
}

function menuResize() {
    for (var a = $("#topmenu"), b = a.innerWidth() - 5, c = a.find(".submenu"), d = c.outerWidth(true), e = c.find("ul"), f = a.find("> li"), g = e.find("li"), h = g.length > 0, j = h ? d : 0, k = 0; k < f.length - 1; k++) j += $(f[k]).outerWidth(true);
    k = f.length - 1;
    for (var n = false; j >= b && --k >= 0;) {
        n = true;
        var l = $(f[k]), m = l.outerWidth(true);
        l.data("width", m);
        if (h) {
            j -= m;
            l.prependTo(e)
        } else {
            j -= m;
            l.prependTo(e);
            j += d;
            h = true
        }
    }
    if (!n) for (k = 0; k < g.length; k++) {
        j += $(g[k]).data("width");
        if (j < b || k == g.length - 1 && j - d < b) $(g[k]).insertBefore(c); else break
    }
    e.find("li").length >
    0 ? c.addClass("shown") : c.removeClass("shown");
    a.find("> li").length == 1 ? e.removeClass().addClass("only") : e.removeClass().addClass("notonly");
    c.find(".tabactive").length ? c.addClass("active").find("> a").removeClass("tab").addClass("tabactive") : c.removeClass("active").find("> a").addClass("tab").removeClass("tabactive")
}

$(function () {
    var a = $("#topmenu");
    if (a.length != 0) {
        var b = $("<a />", {href: "#", "class": "tab"}).text(PMA_messages.strMore).click(function (c) {
            c.preventDefault()
        });
        a.find("li:first-child img").length && $(PMA_getImage("b_more.png").toString()).prependTo(b);
        b = $("<li />", {"class": "submenu"}).append(b).append($("<ul />")).mouseenter(function () {
            $(this).find("ul .tabactive").length == 0 && $(this).addClass("submenuhover").find("> a").addClass("tabactive")
        }).mouseleave(function () {
            $(this).find("ul .tabactive").length ==
            0 && $(this).removeClass("submenuhover").find("> a").removeClass("tabactive")
        });
        a.append(b);
        menuResize();
        $(window).resize(menuResize)
    }
});

function PMA_getRowNumber(a) {
    return parseInt(a.split(/\s+row_/)[1])
}

function PMA_set_status_label(a) {
    var b = a.css("display") == "none" ? "+ " : "- ";
    a.closest(".slide-wrapper").prev().find("span").text(b)
}

function PMA_init_slider() {
    $(".pma_auto_slider").each(function () {
        var a = $(this);
        if (!a.hasClass("slider_init_done")) {
            a.addClass("slider_init_done");
            var b = $("<div>", {"class": "slide-wrapper"});
            b.toggle(a.is(":visible"));
            $("<a>", {href: "#" + this.id}).text(this.title).prepend($("<span>")).insertBefore(a).click(function () {
                var c = a.closest(".slide-wrapper"), d = a.is(":visible");
                d || c.show();
                a[d ? "hide" : "show"]("blind", function () {
                    c.toggle(!d);
                    PMA_set_status_label(a)
                });
                return false
            });
            a.wrap(b);
            PMA_set_status_label(a)
        }
    })
}

var toggleButton = function (a) {
    var b = $(".text_direction", a).text() == "ltr" ? "right" : "left", c = a.height();
    $("img", a).height(c);
    $("table", a).css("bottom", c - 1);
    c = $(".toggleOn", a).width();
    var d = $(".toggleOff", a).width();
    $(".toggleOn > div", a).width(Math.max(c, d) + 2);
    $(".toggleOff > div", a).width(Math.max(c, d) + 2);
    c = parseInt($("img", a).height() / 16 * 22, 10);
    $("table td:nth-child(2) > div", a).width(c);
    c = $("img", a).width();
    d = $("table", a).width();
    c = parseInt((c - d) / 2, 10);
    a.find("img").css(b, c);
    c = $(".toggleOff", a).outerWidth();
    d = $("table td:nth-child(2)", a).outerWidth();
    a.width(c + d + 2);
    var e = $(".toggleOff", a).outerWidth();
    if ($(".container", a).hasClass("off")) b == "right" ? $("table, img", a).animate({left: "-=" + e + "px"}, 0) : $("table, img", a).animate({left: "+=" + e + "px"}, 0);
    $(".container", a).click(function () {
        if ($(this).hasClass("isActive")) return false; else $(this).addClass("isActive");
        var f = PMA_ajaxShowMessage(), g = $(this), h = $(".callback", this).text();
        if ($(this).hasClass("on")) var j = b == "right" ? "-=" : "+=", k = $(this).find(".toggleOff > span").text(),
            n = "on", l = "off"; else {
            j = b == "right" ? "+=" : "-=";
            k = $(this).find(".toggleOn > span").text();
            n = "off";
            l = "on"
        }
        $.post(k, {ajax_request: true}, function (m) {
            if (m.success == true) {
                PMA_ajaxRemoveMessage(f);
                g.removeClass(n).addClass(l).animate({left: j + e + "px"}, function () {
                    g.removeClass("isActive")
                });
                eval(h)
            } else {
                PMA_ajaxShowMessage(m.error, false);
                g.removeClass("isActive")
            }
        })
    })
};
$(window).load(function () {
    $(".toggleAjax").each(function () {
        $(this).show().find(".toggleButton");
        toggleButton($(this))
    })
});
$(document).ready(function () {
    $(".vpointer").live("hover", function () {
        var a = $(this);
        a = PMA_getRowNumber(a.attr("class"));
        $(".vpointer").filter(".row_" + a).toggleClass("hover")
    })
});
$(document).ready(function () {
    $(".vmarker").live("click", function (a) {
        if (!$(a.target).is("a, img, a *")) {
            var b = $(this);
            b = PMA_getRowNumber(b.attr("class"));
            $(this);
            var c = $(".vmarker").filter(".row_" + b + ":first").find(":checkbox");
            if (c.length) {
                var d = c.attr("checked");
                if (!$(a.target).is(":checkbox, label")) {
                    d = !d;
                    c.attr("checked", d)
                }
                d ? $(".vmarker").filter(".row_" + b).addClass("marked") : $(".vmarker").filter(".row_" + b).removeClass("marked")
            } else $(".vmarker").filter(".row_" + b).toggleClass("marked")
        }
    });
    $("#visual_builder_anchor").show();
    $("#tableslistcontainer").find("#pageselector").live("change", function () {
        $(this).parent("form").submit()
    });
    $("#navidbpageselector").find("#pageselector").live("change", function () {
        $(this).parent("form").submit()
    });
    $("#body_browse_foreigners").find("#pageselector").live("change", function () {
        $(this).closest("form").submit()
    });
    $(".jsversioncheck").length > 0 && $.getScript("http://www.phpmyadmin.net/home_page/version.js", PMA_current_version);
    PMA_init_slider();
    $('a[class~="formLinkSubmit"]').live("click", function () {
        if ($(this).attr("href").indexOf("=") !=
            -1) {
            var a = $(this).attr("href").substr($(this).attr("href").indexOf("#") + 1).split("=", 2);
            $(this).parents("form").append('<input type="hidden" name="' + a[0] + '" value="' + a[1] + '"/>')
        }
        $(this).parents("form").submit();
        return false
    });
    $("#update_recent_tables").ready(function () {
        window.parent.frame_navigation != undefined && window.parent.frame_navigation.PMA_reloadRecentTable != undefined && window.parent.frame_navigation.PMA_reloadRecentTable()
    })
});

function PMA_slidingMessage(a, b) {
    if (a == undefined || a.length == 0) return false;
    if (b == undefined || !b instanceof jQuery || b.length == 0) {
        $("#PMA_slidingMessage").length == 0 && $("#floating_menubar").after('<span id="PMA_slidingMessage" style="display: inline-block;"></span>');
        b = $("#PMA_slidingMessage")
    }
    if (b.has("div").length > 0) b.find("div").first().fadeOut(function () {
        b.children().remove();
        b.append('<div style="display: none;">' + a + "</div>").animate({height: b.find("div").first().height()}).find("div").first().fadeIn()
    });
    else {
        var c = b.width("100%").html('<div style="display: none;">' + a + "</div>").find("div").first().height();
        b.find("div").first().css("height", 0).show().animate({height: c}, function () {
            b.height(b.find("div").first().height())
        })
    }
    return true
}

$(document).ready(function () {
    $("#drop_tbl_anchor").live("click", function (a) {
        a.preventDefault();
        a = PMA_messages.strDropTableStrongWarning + "\n" + PMA_messages.strDoYouReally + " :\nDROP TABLE " + window.parent.table;
        $(this).PMA_confirm(a, $(this).attr("href"), function (b) {
            PMA_ajaxShowMessage(PMA_messages.strProcessingRequest);
            $.get(b, {is_js_confirmed: "1", ajax_request: true}, function () {
                window.parent.refreshNavigation();
                window.parent.refreshMain()
            })
        })
    })
});
$(document).ready(function () {
    $("#truncate_tbl_anchor.ajax").live("click", function (a) {
        a.preventDefault();
        a = PMA_messages.strTruncateTableStrongWarning + "\n" + PMA_messages.strDoYouReally + " :\nTRUNCATE TABLE " + window.parent.table;
        $(this).PMA_confirm(a, $(this).attr("href"), function (b) {
            PMA_ajaxShowMessage(PMA_messages.strProcessingRequest);
            $.get(b, {is_js_confirmed: "1", ajax_request: true}, function (c) {
                $("#sqlqueryresults").length != 0 && $("#sqlqueryresults").remove();
                $("#result_query").length != 0 && $("#result_query").remove();
                if (c.success == true) {
                    PMA_ajaxShowMessage(c.message);
                    $("<div id='sqlqueryresults'></div>").insertAfter("#floating_menubar");
                    $("#sqlqueryresults").html(c.sql_query)
                } else {
                    var d = $("<div id='temp_div'></div>");
                    d.html(c.error);
                    c = d.find("code").addClass("error");
                    PMA_ajaxShowMessage(c, false)
                }
            })
        })
    })
});
$(document).ready(function () {
    var a = $("#sqlquery");
    if (a.length > 0 && typeof CodeMirror != "undefined") codemirror_editor = CodeMirror.fromTextArea(a[0], {
        lineNumbers: true,
        matchBrackets: true,
        indentUnit: 4,
        mode: "text/x-mysql",
        lineWrapping: true
    })
});
(function (a) {
    a.fn.noSelect = function (b) {
        return (b == null ? true : b) ? this.each(function () {
            if (a.browser.msie || a.browser.safari) a(this).bind("selectstart", function () {
                return false
            }); else if (a.browser.mozilla) {
                a(this).css("MozUserSelect", "none");
                a("body").trigger("focus")
            } else a.browser.opera ? a(this).bind("mousedown", function () {
                return false
            }) : a(this).attr("unselectable", "on")
        }) : this.each(function () {
            if (a.browser.msie || a.browser.safari) a(this).unbind("selectstart"); else if (a.browser.mozilla) a(this).css("MozUserSelect",
                "inherit"); else a.browser.opera ? a(this).unbind("mousedown") : a(this).removeAttr("unselectable", "on")
        })
    }
})(jQuery);
(function (a) {
    a.fn.filterByValue = function (b) {
        return this.filter(function () {
            return a(this).val() === b
        })
    }
})(jQuery);

function PMA_createqTip(a, b, c) {
    $("#no_hint").length > 0 || a.qtip($.extend(true, {
        content: b,
        style: {classes: {tooltip: "normalqTip", content: "normalqTipContent"}, name: "dark"},
        position: {target: "mouse", corner: {target: "rightMiddle", tooltip: "leftMiddle"}, adjust: {x: 10, y: 20}},
        show: {delay: 0, effect: {type: "grow", length: 150}},
        hide: {effect: {type: "grow", length: 200}}
    }, c))
}

function PMA_getCellValue(a) {
    return $(a).is(".null") ? "" : !$(a).is(".to_be_saved") && $(a).data("original_data") ? $(a).data("original_data") : $(a).text()
}

loadJavascript = function (a) {
    if ($.isArray(a)) for (var b = 0; b < a.length; b++) $("head").append('<script type="text/javascript" src="' + a[b] + '"><\/script>'); else $("head").append('<script type="text/javascript" src="' + a + '"><\/script>')
};
$(document).ready(function () {
    $("a.themeselect").live("click", function (a) {
        window.open(a.target, "themes", "left=10,top=20,width=510,height=350,scrollbars=yes,status=yes,resizable=yes");
        return false
    });
    $(".autosubmit").change(function (a) {
        a.target.form.submit()
    });
    $(".take_theme").click(function () {
        var a = this.name;
        if (window.opener && window.opener.document.forms.setTheme.elements.set_theme) {
            window.opener.document.forms.setTheme.elements.set_theme.value = a;
            window.opener.document.forms.setTheme.submit();
            window.close();
            return false
        }
        return true
    })
});

function PMA_clearSelection() {
    if (document.selection && document.selection.empty) document.selection.empty(); else if (window.getSelection) {
        var a = window.getSelection();
        a.empty && a.empty();
        a.removeAllRanges && a.removeAllRanges()
    }
}

function escapeHtml(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

function printPage() {
    typeof window.print != "undefined" && window.print()
}

$(document).ready(function () {
    $("input#print").click(printPage)
});
$(document).ready(function () {
    if ($("#floating_menubar").length && $("#PMA_disable_floating_menubar").length == 0) {
        $("#floating_menubar").css({
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            "z-index": 500
        }).append($("#serverinfo")).append($("#topmenucontainer"));
        $("body").css("padding-top", $("#floating_menubar").outerHeight(true))
    }
});

function toggleRowColors(a) {
    for (a = a; a.length > 0; a = a.next()) if (a.hasClass("odd")) a.removeClass("odd").addClass("even"); else a.hasClass("even") && a.removeClass("even").addClass("odd")
};
