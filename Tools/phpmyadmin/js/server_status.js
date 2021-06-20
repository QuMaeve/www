$(function () {
    $(".jsfeature").show();
    jQuery.tablesorter.addParser({
        id: "fancyNumber", is: function (c) {
            return /^[0-9]?[0-9,\.]*\s?(k|M|G|T|%)?$/.test(c)
        }, format: function (c) {
            var i = jQuery.tablesorter.formatFloat(c.replace(PMA_messages.strThousandsSeperator, "").replace(PMA_messages.strDecimalSeperator, ".")),
                h = 1;
            switch (c.charAt(c.length - 1)) {
                case "%":
                    h = -2;
                    break;
                case "k":
                    h = 3;
                    break;
                case "M":
                    h = 6;
                    break;
                case "G":
                    h = 9;
                    break;
                case "T":
                    h = 12
            }
            return i * Math.pow(10, h)
        }, type: "numeric"
    });
    jQuery.tablesorter.addParser({
        id: "withinSpanNumber",
        is: function (c) {
            return /<span class="original"/.test(c)
        }, format: function (c, i, h) {
            return (c = h.innerHTML.match(/<span(\s*style="display:none;"\s*)?\s*class="original">(.*)?<\/span>/)) && c.length >= 3 ? c[2] : 0
        }, type: "numeric"
    });
    jQuery.tablesorter.addWidget({
        id: "fast-zebra", format: function (c) {
            if (c.config.debug) var i = new Date;
            $("tr:even", c.tBodies[0]).removeClass(c.config.widgetZebra.css[0]).addClass(c.config.widgetZebra.css[1]);
            $("tr:odd", c.tBodies[0]).removeClass(c.config.widgetZebra.css[1]).addClass(c.config.widgetZebra.css[0]);
            c.config.debug && $.tablesorter.benchmark("Applying Fast-Zebra widget", i)
        }
    });
    $('a[rel="popupLink"]').click(function () {
        var c = $(this);
        $("." + c.attr("href").substr(1)).show().offset({
            top: c.offset().top + c.height() + 5,
            left: c.offset().left
        }).addClass("openedPopup");
        return false
    });
    $(document).click(function (c) {
        $(".openedPopup").each(function () {
            var i = $(this), h = $(this).offset();
            if (c.pageX < h.left || c.pageY < h.top || c.pageX > h.left + i.outerWidth() || c.pageY > h.top + i.outerHeight()) i.hide().removeClass("openedPopup")
        })
    })
});
$(function () {
    function c(a, b, d) {
        if (d != null) {
            if (k[a.attr("id")] != "static") {
                clearTimeout(chart_activeTimeouts[a.attr("id") + "_chart_cnt"]);
                chart_activeTimeouts[a.attr("id") + "_chart_cnt"] = null;
                p[a.attr("id")].destroy();
                a.find(".buttonlinks select").get(0).selectedIndex = 2
            }
            if (!d.chart) d.chart = {};
            d.chart.renderTo = a.attr("id") + "_chart_cnt";
            a.find(".tabInnerContent").hide().after('<div class="liveChart" id="' + a.attr("id") + '_chart_cnt"></div>');
            p[a.attr("id")] = PMA_createChart(d);
            $(b).html(PMA_messages.strStaticData);
            a.find(".buttonlinks a.tabRefresh").hide();
            a.find(".buttonlinks .refreshList").show()
        } else {
            clearTimeout(chart_activeTimeouts[a.attr("id") + "_chart_cnt"]);
            chart_activeTimeouts[a.attr("id") + "_chart_cnt"] = null;
            a.find(".tabInnerContent").show();
            a.find("div#" + a.attr("id") + "_chart_cnt").remove();
            k[a.attr("id")] = "static";
            p[a.attr("id")].destroy();
            a.find(".buttonlinks a.tabRefresh").show();
            a.find(".buttonlinks select").get(0).selectedIndex = 2;
            a.find(".buttonlinks .refreshList").hide()
        }
    }

    function i(a, b) {
        if (!($(a).data("init-done") &&
            !b)) {
            $(a).data("init-done", true);
            switch (a.attr("id")) {
                case "statustabs_traffic":
                    b != null && a.find(".tabInnerContent").html(b);
                    PMA_convertFootnotesToTooltips();
                    break;
                case "statustabs_queries":
                    if (b != null) {
                        w.destroy();
                        a.find(".tabInnerContent").html(b)
                    }
                    var d = [];
                    $.each(jQuery.parseJSON($("#serverstatusquerieschart span").html()), function (e, f) {
                        d.push([e, parseInt(f)])
                    });
                    w = PMA_createChart({
                        chart: {renderTo: "serverstatusquerieschart"},
                        title: {text: "", margin: 0},
                        series: [{
                            type: "pie", name: PMA_messages.strChartQueryPie,
                            data: d
                        }],
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: "pointer",
                                dataLabels: {
                                    enabled: true, formatter: function () {
                                        return "<b>" + this.point.name + "</b><br/> " + Highcharts.numberFormat(this.percentage, 2) + " %"
                                    }
                                }
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                return "<b>" + this.point.name + "</b><br/>" + Highcharts.numberFormat(this.y, 2) + "<br/>(" + Highcharts.numberFormat(this.percentage, 2) + " %)"
                            }
                        }
                    });
                    h(a.attr("id"));
                    break;
                case "statustabs_allvars":
                    if (b != null) {
                        a.find(".tabInnerContent").html(b);
                        q()
                    }
                    h(a.attr("id"))
            }
        }
    }

    function h(a) {
        var b,
            d;
        switch (a) {
            case "statustabs_queries":
                b = $("#serverstatusqueriesdetails");
                d = {
                    sortList: [[3, 1]],
                    widgets: ["fast-zebra"],
                    headers: {1: {sorter: "fancyNumber"}, 2: {sorter: "fancyNumber"}}
                };
                break;
            case "statustabs_allvars":
                b = $("#serverstatusvariables");
                d = {sortList: [[0, 0]], widgets: ["fast-zebra"], headers: {1: {sorter: "withinSpanNumber"}}}
        }
        b.tablesorter(d);
        b.find("tr:first th").append('<img class="icon sortableIcon" src="themes/dot.gif" alt="">')
    }

    function q() {
        var a = 0, b = x;
        if (n.length > 0) b = n;
        b.length > 1 && $("#linkSuggestions span").each(function () {
            if ($(this).attr("class").indexOf("status_" +
                b) != -1) {
                a++;
                $(this).css("display", "")
            } else $(this).css("display", "none")
        });
        a > 0 ? $("#linkSuggestions").css("display", "") : $("#linkSuggestions").css("display", "none");
        r = false;
        $("#serverstatusvariables th.name").each(function () {
            if ((t == null || t.exec($(this).text())) && (!y || $(this).next().find("span.attention").length > 0) && (n.length == 0 || $(this).parent().hasClass("s_" + n))) {
                r = !r;
                $(this).parent().css("display", "");
                if (r) {
                    $(this).parent().addClass("odd");
                    $(this).parent().removeClass("even")
                } else {
                    $(this).parent().addClass("even");
                    $(this).parent().removeClass("odd")
                }
            } else $(this).parent().css("display", "none")
        })
    }

    function A(a, b) {
        var d, e, f = 0, g = [], l = [], m = 0, j = 0;
        $.each(a.pointInfo, function (s, u) {
            if (u - b.pointInfo[s] > 0) {
                g.push(s);
                l.push(u - b.pointInfo[s]);
                j += u - b.pointInfo[s]
            }
        });
        for (var B = g.length, v = "<b>" + PMA_messages.strTotal + ": " + j + "</b><br>"; g.length > 0;) {
            for (var o = d = 0; o < g.length; o++) if (l[o] > d) {
                d = l[o];
                e = o
            }
            if (B > 8 && f >= 6) m += l[e]; else v += g[e].substr(4).replace("_", " ") + ": " + l[e] + "<br>";
            g.splice(e, 1);
            l.splice(e, 1);
            f++
        }
        if (m > 0) v += PMA_messages.strOther +
            ": " + m;
        return v
    }

    var t = null, y = false, n = "", r = false, x = "", w = null, z = false, k = {}, p = {};
    PMA_createqTip($("table.sortable thead th"), PMA_messages.strSortHint);
    Highcharts.setOptions({global: {useUTC: false}});
    $.ajaxSetup({cache: false});
    $("#serverStatusTabs").tabs({
        cookie: {name: "pma_serverStatusTabs", expires: 1}, show: function (a, b) {
            menuResize();
            $(b.tab.hash).data("init-done") || i($(b.tab.hash), null);
            if (b.tab.hash == "#statustabs_charting" && !z) {
                $("div#statustabs_charting").append('<img class="ajaxIcon" id="loadingMonitorIcon" src="' +
                    pmaThemeImage + 'ajax_clock_small.gif" alt="">');
                setTimeout(function () {
                    loadJavascript(["js/jquery/timepicker.js", "js/jquery/jquery.json-2.2.js", "js/jquery/jquery.sprintf.js", "js/jquery/jquery.sortableTable.js", "js/codemirror/lib/codemirror.js", "js/codemirror/mode/mysql/mysql.js", "js/server_status_monitor.js"])
                }, 50);
                z = true
            }
            b.tab.hash == "#statustabs_advisor" && $("table#rulesFired").length == 0 && setTimeout(function () {
                $('a[href="#startAnalyzer"]').trigger("click")
            }, 25)
        }
    });
    $(".ui-widget-content:not(.ui-tabs):not(.ui-helper-clearfix)").addClass("ui-helper-clearfix");
    $("div.ui-tabs-panel").each(function () {
        var a = $(this);
        k[a.attr("id")] = "static";
        setTimeout(function () {
            i(a, null)
        }, 0.5)
    });
    $(".buttonlinks select").change(function () {
        var a = p[$(this).parents("div.ui-tabs-panel").attr("id")];
        clearTimeout(chart_activeTimeouts[a.options.chart.renderTo]);
        a.options.realtime.postRequest && a.options.realtime.postRequest.abort();
        a.options.realtime.refreshRate = 1E3 * parseInt(this.value);
        a.xAxis[0].setExtremes((new Date).getTime() - server_time_diff - a.options.realtime.numMaxPoints * a.options.realtime.refreshRate,
            (new Date).getTime() - server_time_diff, true);
        chart_activeTimeouts[a.options.chart.renderTo] = setTimeout(a.options.realtime.timeoutCallBack, a.options.realtime.refreshRate)
    });
    $(".buttonlinks a.tabRefresh").click(function () {
        var a = $(this).parents("div.ui-tabs-panel"), b = this;
        $(this).find("img").show();
        $.get($(this).attr("href"), {ajax_request: 1}, function (d) {
            $(b).find("img").hide();
            i(a, d)
        });
        k[a.attr("id")] = "data";
        return false
    });
    $(".buttonlinks a.livetrafficLink").click(function () {
        var a = $(this).parents("div.ui-tabs-panel"),
            b = k[a.attr("id")];
        if (b == "static" || b == "liveconnections") {
            c(a, this, {
                series: [{name: PMA_messages.strChartKBSent, data: []}, {
                    name: PMA_messages.strChartKBReceived,
                    data: []
                }], title: {text: PMA_messages.strChartServerTraffic}, realtime: {
                    url: "server_status.php?" + url_query, type: "traffic", callback: function (d, e, f, g) {
                        if (f != null) {
                            d.series[0].addPoint({
                                x: e.x,
                                y: (e.y_sent - f.y_sent) / 1024
                            }, false, g >= d.options.realtime.numMaxPoints);
                            d.series[1].addPoint({
                                x: e.x,
                                y: (e.y_received - f.y_received) / 1024
                            }, true, g >= d.options.realtime.numMaxPoints)
                        }
                    },
                    error: function () {
                        serverResponseError()
                    }
                }
            });
            b == "liveconnections" && a.find(".buttonlinks a.liveconnectionsLink").html(PMA_messages.strLiveConnChart);
            k[a.attr("id")] = "livetraffic"
        } else {
            $(this).html(PMA_messages.strLiveTrafficChart);
            c(a, this, null)
        }
        return false
    });
    $(".buttonlinks a.liveconnectionsLink").click(function () {
        var a = $(this).parents("div.ui-tabs-panel"), b = k[a.attr("id")];
        if (b == "static" || b == "livetraffic") {
            c(a, this, {
                series: [{name: PMA_messages.strChartConnections, data: []}, {
                    name: PMA_messages.strChartProcesses,
                    data: []
                }],
                title: {text: PMA_messages.strChartConnectionsTitle},
                realtime: {
                    url: "server_status.php?" + url_query, type: "proc", callback: function (d, e, f, g) {
                        if (f != null) {
                            d.series[0].addPoint({
                                x: e.x,
                                y: e.y_conn - f.y_conn
                            }, false, g >= d.options.realtime.numMaxPoints);
                            d.series[1].addPoint({x: e.x, y: e.y_proc}, true, g >= d.options.realtime.numMaxPoints)
                        }
                    }, error: function () {
                        serverResponseError()
                    }
                }
            });
            b == "livetraffic" && a.find(".buttonlinks a.livetrafficLink").html(PMA_messages.strLiveTrafficChart);
            k[a.attr("id")] = "liveconnections"
        } else {
            $(this).html(PMA_messages.strLiveConnChart);
            c(a, this, null)
        }
        return false
    });
    $(".buttonlinks a.livequeriesLink").click(function () {
        var a = $(this).parents("div.ui-tabs-panel"), b = null;
        if (k[a.attr("id")] == "static") b = {
            series: [{name: PMA_messages.strChartIssuedQueries, data: []}],
            title: {text: PMA_messages.strChartIssuedQueriesTitle},
            tooltip: {
                formatter: function () {
                    return this.point.name
                }
            },
            realtime: {
                url: "server_status.php?" + url_query, type: "queries", callback: function (d, e, f, g) {
                    f != null && d.series[0].addPoint({
                        x: e.x,
                        y: e.y - f.y,
                        name: A(e, f)
                    }, true, g >= d.options.realtime.numMaxPoints)
                },
                error: function () {
                    serverResponseError()
                }
            }
        }; else $(this).html(PMA_messages.strLiveQueryChart);
        c(a, this, b);
        k[a.attr("id")] = "livequeries";
        return false
    });
    $("#filterAlert").change(function () {
        y = this.checked;
        q()
    });
    $("#filterText").keyup(function () {
        var a = $(this).val().replace(/_/g, " ");
        t = a.length == 0 ? null : RegExp("(^| )" + a, "i");
        x = a;
        q()
    });
    $("#filterCategory").change(function () {
        n = $(this).val();
        q()
    });
    $("input#dontFormat").change(function () {
        $("#serverstatusvariables").hide();
        $("#serverstatusvariables td.value span.original").toggle(this.checked);
        $("#serverstatusvariables td.value span.formatted").toggle(!this.checked);
        $("#serverstatusvariables").show()
    });
    $('a[href="#openAdvisorInstructions"]').click(function () {
        var a = {};
        a[PMA_messages.strClose] = function () {
            $(this).dialog("close")
        };
        $("#advisorInstructionsDialog").attr("title", PMA_messages.strAdvisorSystem);
        $("#advisorInstructionsDialog").dialog({width: 700, buttons: a})
    });
    $('a[href="#startAnalyzer"]').click(function () {
        var a = $("#statustabs_advisor .tabInnerContent");
        a.html('<img class="ajaxIcon" src="' +
            pmaThemeImage + 'ajax_clock_small.gif" alt="">');
        $.get("server_status.php?" + url_query, {ajax_request: true, advisor: true}, function (b) {
            var d, e, f = true;
            b = $.parseJSON(b);
            a.html("");
            if (b.parse.errors.length > 0) {
                a.append("<b>Rules file not well formed, following errors were found:</b><br />- ");
                a.append(b.parse.errors.join("<br/>- "));
                a.append("<p></p>")
            }
            if (b.run.errors.length > 0) {
                a.append("<b>Errors occured while executing rule expressions:</b><br />- ");
                a.append(b.run.errors.join("<br/>- "));
                a.append("<p></p>")
            }
            if (b.run.fired.length >
                0) {
                a.append("<p><b>" + PMA_messages.strPerformanceIssues + "</b></p>");
                a.append('<table class="data" id="rulesFired" border="0"><thead><tr><th>' + PMA_messages.strIssuse + "</th><th>" + PMA_messages.strRecommendation + "</th></tr></thead><tbody></tbody></table>");
                d = a.find("table#rulesFired");
                var g;
                $.each(b.run.fired, function (l, m) {
                    g = $.trim($("<div>").html(m.recommendation).text());
                    d.append(e = $('<tr class="linkElem noclick ' + (f ? "even" : "odd") + '"><td>' + m.issue + "</td><td>" + g + " </td></tr>"));
                    f = !f;
                    e.data("rule", m);
                    e.click(function () {
                        var j = $(this).data("rule");
                        $("div#emptyDialog").dialog({title: PMA_messages.strRuleDetails});
                        $("div#emptyDialog").html("<p><b>" + PMA_messages.strIssuse + ":</b><br />" + j.issue + "</p><p><b>" + PMA_messages.strRecommendation + ":</b><br />" + j.recommendation + "</p><p><b>" + PMA_messages.strJustification + ":</b><br />" + j.justification + "</p><p><b>" + PMA_messages.strFormula + ":</b><br />" + j.formula + "</p><p><b>" + PMA_messages.strTest + ":</b><br />" + j.test + "</p>");
                        j = {};
                        j[PMA_messages.strClose] = function () {
                            $(this).dialog("close")
                        };
                        $("div#emptyDialog").dialog({width: 600, buttons: j})
                    })
                })
            }
        });
        return false
    })
});

function serverResponseError() {
    var c = {};
    c[PMA_messages.strReloadPage] = function () {
        window.location.reload()
    };
    $("#emptyDialog").dialog({title: PMA_messages.strRefreshFailed});
    $("#emptyDialog").html(PMA_getImage("s_attention.png") + PMA_messages.strInvalidResponseExplanation);
    $("#emptyDialog").dialog({buttons: c})
};
