var $data_a;

function PMA_urldecode(a) {
    return decodeURIComponent(a.replace(/\+/g, "%20"))
}

function PMA_urlencode(a) {
    return encodeURIComponent(a).replace(/\%20/g, "+")
}

function getFieldName(a) {
    var b = a.index(),
        c = !$("#table_results").find("th:first").hasClass("draggable") ? $("#table_results").find("th:first").attr("colspan") - 1 : 0;
    a = $("#table_results").find("thead").find("th:eq(" + (b - c) + ") a").text();
    if ("" == a) {
        b = $("#table_results").find("thead").find("th:eq(" + (b - c) + ")").children("span");
        c = b.children().detach();
        a = b.text();
        b.append(c)
    }
    return a = $.trim(a)
}

$(document).ready(function () {
    $("input#bkm_label").keyup(function () {
        $("input#id_bkm_all_users, input#id_bkm_replace").parent().toggle($(this).attr("value").length > 0)
    }).trigger("keyup");
    $("#sqlqueryresults").live("makegrid", function () {
        PMA_makegrid($("#table_results")[0])
    });
    if (!$("#sqlqueryform").find("a").is("#togglequerybox")) {
        $('<a id="togglequerybox"></a>').html(PMA_messages.strHideQueryBox).appendTo("#sqlqueryform").hide();
        $("#togglequerybox").bind("click", function () {
            var a = $(this);
            a.siblings().slideToggle("fast");
            if (a.text() == PMA_messages.strHideQueryBox) {
                a.text(PMA_messages.strShowQueryBox);
                $("#togglequerybox_spacer").remove();
                a.before('<br id="togglequerybox_spacer" />')
            } else a.text(PMA_messages.strHideQueryBox);
            return false
        })
    }
    $("#button_submit_query").live("click", function () {
        $(this).closest("form").find("select[name=id_bookmark]").attr("value", "")
    });
    $("input[name=bookmark_variable]").bind("keypress", function (a) {
        if ((a.keyCode ? a.keyCode : a.which ? a.which : a.charCode) == 13) {
            $("#button_submit_bookmark").click();
            return false
        } else return true
    });
    $("#sqlqueryform.ajax").live("submit", function (a) {
        a.preventDefault();
        var b = $(this);
        if (!checkSqlQuery(b[0])) return false;
        $(".error").remove();
        var c = PMA_ajaxShowMessage(), e = $("#sqlqueryresults");
        PMA_prepareForAjaxRequest(b);
        $.post(b.attr("action"), b.serialize(), function (d) {
            if (d.success == true) {
                $(".success").fadeOut();
                $(".sqlquery_message").fadeOut();
                if (typeof d.action_bookmark != "undefined") {
                    if ("1" == d.action_bookmark) {
                        $("#sqlquery").text(d.sql_query);
                        setQuery(d.sql_query)
                    }
                    "2" ==
                    d.action_bookmark && $("#id_bookmark option[value='" + d.id_bookmark + "']").remove();
                    $("#sqlqueryform").before(d.message)
                } else if (typeof d.sql_query != "undefined") {
                    $('<div class="sqlquery_message"></div>').html(d.sql_query).insertBefore("#sqlqueryform");
                    $(".notice").remove()
                } else $("#sqlqueryform").before(d.message);
                e.show();
                if (typeof d.reload != "undefined") {
                    $("#sqlqueryform.ajax").die("submit");
                    b.find("input[name=db]").val(d.db);
                    b.find("input[name=ajax_request]").remove();
                    b.append('<input type="hidden" name="reload" value="true" />');
                    $.post("db_sql.php", b.serialize(), function (g) {
                        $("body").html(g)
                    })
                }
            } else if (d.success == false) {
                $("#sqlqueryform").before(d.error);
                e.hide()
            } else {
                $(".success").fadeOut();
                $(".sqlquery_message").fadeOut();
                var f = $(d).find('textarea[name="sql_query"]');
                if (f.length > 0) {
                    $("#sqlquery").val(f.val());
                    setQuery($("#sqlquery").val())
                } else {
                    e.show().html(d).trigger("makegrid");
                    $("#togglequerybox").show();
                    $('#sqlqueryform input[name="retain_query_box"]').is(":checked") != true && $("#togglequerybox").siblings(":visible").length >
                    0 && $("#togglequerybox").trigger("click");
                    PMA_init_slider()
                }
            }
            PMA_ajaxRemoveMessage(c)
        })
    });
    $("input[name=navig].ajax").live("click", function (a) {
        a.preventDefault();
        var b = PMA_ajaxShowMessage();
        a = $(this).parent("form");
        PMA_prepareForAjaxRequest(a);
        $.post(a.attr("action"), a.serialize(), function (c) {
            $("#sqlqueryresults").html(c).trigger("makegrid");
            PMA_init_slider();
            PMA_ajaxRemoveMessage(b)
        })
    });
    $("#pageselector").live("change", function (a) {
        var b = $(this).parent("form");
        if ($(this).hasClass("ajax")) {
            a.preventDefault();
            var c = PMA_ajaxShowMessage();
            $.post(b.attr("action"), b.serialize() + "&ajax_request=true", function (e) {
                $("#sqlqueryresults").html(e).trigger("makegrid");
                PMA_init_slider();
                PMA_ajaxRemoveMessage(c)
            })
        } else b.submit()
    });
    $("#table_results.ajax").find("a[title=Sort]").live("click", function (a) {
        a.preventDefault();
        var b = PMA_ajaxShowMessage();
        $anchor = $(this);
        $.get($anchor.attr("href"), $anchor.serialize() + "&ajax_request=true", function (c) {
            $("#sqlqueryresults").html(c).trigger("makegrid");
            PMA_ajaxRemoveMessage(b)
        })
    });
    $("#displayOptionsForm.ajax").live("submit", function (a) {
        a.preventDefault();
        $form = $(this);
        $.post($form.attr("action"), $form.serialize() + "&ajax_request=true", function (b) {
            $("#sqlqueryresults").html(b).trigger("makegrid");
            PMA_init_slider()
        })
    });
    $("#resultsForm.ajax .mult_submit[value=edit]").live("click", function (a) {
        a.preventDefault();
        if ($("#table_results tbody tr, #table_results tbody tr td").hasClass("marked")) {
            var b = $('<div id="change_row_dialog"></div>'), c = {};
            c[PMA_messages.strCancel] = function () {
                $(this).dialog("close").remove()
            };
            var e = {};
            e[PMA_messages.strOK] = function () {
                $(this).dialog("close").remove()
            };
            a = $("#resultsForm");
            var d = PMA_ajaxShowMessage();
            $.get(a.attr("action"), a.serialize() + "&ajax_request=true&submit_mult=row_edit", function (f) {
                if (f.success != undefined && f.success == false) b.append(f.error).dialog({
                    title: PMA_messages.strChangeTbl,
                    height: 230,
                    width: 900,
                    open: PMA_verifyColumnsProperties,
                    close: function () {
                        $("#change_row_dialog").remove()
                    },
                    buttons: e
                }); else {
                    b.append(f).dialog({
                        title: PMA_messages.strChangeTbl, height: 600, width: 900,
                        open: PMA_verifyColumnsProperties, close: function () {
                            $("#change_row_dialog").remove()
                        }, buttons: c
                    }).find("#topmenucontainer").hide();
                    $(".insertRowTable").addClass("ajax");
                    $("#buttonYes").addClass("ajax")
                }
                PMA_ajaxRemoveMessage(d)
            })
        } else PMA_ajaxShowMessage(PMA_messages.strNoRowSelected)
    });
    $("#insertForm .insertRowTable.ajax input[type=submit]").live("click", function (a) {
        a.preventDefault();
        a = $("#insertForm");
        PMA_prepareForAjaxRequest(a);
        $.post(a.attr("action"), a.serialize(), function (b) {
            if (b.success == true) {
                PMA_ajaxShowMessage(b.message);
                $("#pageselector").length != 0 ? $("#pageselector").trigger("change") : $("input[name=navig].ajax").trigger("click")
            } else {
                PMA_ajaxShowMessage(b.error, false);
                $("#table_results tbody tr.marked .multi_checkbox , #table_results tbody tr td.marked .multi_checkbox").prop("checked", false);
                $("#table_results tbody tr.marked .multi_checkbox , #table_results tbody tr td.marked .multi_checkbox").removeClass("last_clicked");
                $("#table_results tbody tr, #table_results tbody tr td").removeClass("marked")
            }
            $("#change_row_dialog").length >
            0 && $("#change_row_dialog").dialog("close").remove();
            $("#result_query").remove();
            $("#sqlqueryresults").prepend(b.sql_query);
            $("#result_query .notice").remove();
            $("#result_query").prepend(b.message)
        })
    });
    $("#buttonYes.ajax").live("click", function (a) {
        a.preventDefault();
        a = $("#insertForm");
        var b = $("#insertForm").find("#actions_panel .control_at_footer option:selected").attr("value");
        $("#insertForm").find("#actions_panel select[name=after_insert] option:selected").attr("value");
        $("#result_query").remove();
        PMA_prepareForAjaxRequest(a);
        $.post(a.attr("action"), a.serialize(), function (c) {
            if (c.success == true) {
                PMA_ajaxShowMessage(c.message);
                if (b == "showinsert") {
                    $("#sqlqueryresults").prepend(c.sql_query);
                    $("#result_query .notice").remove();
                    $("#result_query").prepend(c.message);
                    $("#table_results tbody tr.marked .multi_checkbox , #table_results tbody tr td.marked .multi_checkbox").prop("checked", false);
                    $("#table_results tbody tr.marked .multi_checkbox , #table_results tbody tr td.marked .multi_checkbox").removeClass("last_clicked");
                    $("#table_results tbody tr, #table_results tbody tr td").removeClass("marked")
                } else {
                    $("#pageselector").length != 0 ? $("#pageselector").trigger("change") : $("input[name=navig].ajax").trigger("click");
                    $("#result_query").remove();
                    $("#sqlqueryresults").prepend(c.sql_query);
                    $("#result_query .notice").remove();
                    $("#result_query").prepend(c.message)
                }
            } else {
                PMA_ajaxShowMessage(c.error, false);
                $("#table_results tbody tr.marked .multi_checkbox , #table_results tbody tr td.marked .multi_checkbox").prop("checked", false);
                $("#table_results tbody tr.marked .multi_checkbox , #table_results tbody tr td.marked .multi_checkbox").removeClass("last_clicked");
                $("#table_results tbody tr, #table_results tbody tr td").removeClass("marked")
            }
            $("#change_row_dialog").length > 0 && $("#change_row_dialog").dialog("close").remove()
        })
    })
}, "top.frame_content");

function PMA_changeClassForColumn(a, b, c) {
    var e = a.index();
    !a.closest("tr").children(":first").hasClass("column_heading") && e--;
    a = a.closest("table").find("tbody tr").find("td.data:eq(" + e + ")");
    c == undefined ? a.toggleClass(b) : a.toggleClass(b, c)
}

$(document).ready(function () {
    $(".browse_foreign").live("click", function (a) {
        a.preventDefault();
        window.open(this.href, "foreigners", "width=640,height=240,scrollbars=yes,resizable=yes");
        $anchor = $(this);
        $anchor.addClass("browse_foreign_clicked");
        return false
    });
    $(".column_heading.pointer").live("hover", function (a) {
        PMA_changeClassForColumn($(this), "hover", a.type == "mouseenter")
    });
    $(".column_heading.marker").live("click", function () {
        PMA_changeClassForColumn($(this), "marked")
    });
    $("#sqlqueryresults").trigger("makegrid")
});

function makeProfilingChart() {
    if ($("#profilingchart").length != 0) {
        var a = [];
        $.each(jQuery.parseJSON($("#profilingchart").html()), function (b, c) {
            a.push([b, parseFloat(c)])
        });
        $("div#profilingchart").html("").show();
        PMA_createProfilingChart(a)
    }
};
