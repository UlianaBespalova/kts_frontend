import "core-js";
import React, {useEffect, useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const confirmedColor = am4core.color("#1c5fe5");
const activeColor = am4core.color("#e2761e");
const recoveredColor = am4core.color("#45d21a");
const deathsColor = am4core.color("#d21a1a");


function ComChart(props) {

    const chart = useRef(null);
    const total_timeline = props.data;

    useEffect(() => {

        let line = am4core.create("chartplotdiv", am4charts.XYChart);
        line.zoomOutButton.disabled = true;
        line.maskBullets = false;
        line.padding (5, 40, 5, 40);

        let data = total_timeline;
        for (let i = 0; i < data.length; i++) {
            let tmp = data[i];
            tmp.active = tmp.confirmed - tmp.recovered - tmp.deaths;
            data[i].active = tmp.active;
        }
        line.data = data;

        const lastDate = new Date(total_timeline[total_timeline.length - 1].date);


        let dateAxis = line.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.renderer.grid.template.stroke = am4core.color("#474747");
        dateAxis.max = lastDate.getTime() + am4core.time.getDuration("day", 5);
        dateAxis.tooltip.label.fontSize = "0.8em";

        let valueAxis = line.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.opposite = true;
        valueAxis.interpolationDuration = 100;
        valueAxis.renderer.grid.template.stroke = am4core.color("#474747");
        valueAxis.renderer.minGridDistance = 30;
        valueAxis.renderer.maxLabelPosition = 0.98;
        valueAxis.tooltip.disabled = true;
        valueAxis.extraMax = 0.05;
        valueAxis.maxPrecision = 0;
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.verticalCenter = "bottom";
        valueAxis.renderer.labels.template.fill = am4core.color("#808080");
        valueAxis.renderer.labels.template.padding(2, 2, 2, 2);

        valueAxis.adapter.add("max", function(max, target) {
            if (max < 5) {
                max = 5
            }
            return max;
        })
        valueAxis.adapter.add("min", function(min, target) {
            if (min < 0) {
                min = 0;
            }
            return min;
        })


        let confirmedSeries = addSeries("confirmed", confirmedColor);
        confirmedSeries.tooltip.disabled = false;
        confirmedSeries.hidden = false;

        let activeSeries = addSeries("active", activeColor);
        let recoveredSeries = addSeries("recovered", recoveredColor);
        let deathsSeries = addSeries("deaths", deathsColor);

        let series = { active: activeSeries, confirmed: confirmedSeries, recovered: recoveredSeries, deaths: deathsSeries };

        function addSeries(name, color) {
            let series = line.series.push(new am4charts.LineSeries())
            series.dataFields.valueY = name;
            series.dataFields.dateX = "date";
            series.name = name;
            series.stroke = color;
            series.strokeWidth = 2;
            series.fill = color;
            series.maskBullets = false;
            series.minBulletDistance = 10;
            series.hidden = true;
            series.hideTooltipWhileZooming = true;

            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.setStateOnChildren = true;
            bullet.circle.fillOpacity = 0.8;
            bullet.circle.fill = am4core.color("#1e2128");
            bullet.circle.radius = 3;

            let circleHoverState = bullet.circle.states.create("hover");
            circleHoverState.properties.fillOpacity = 1;
            circleHoverState.properties.fill = color;
            circleHoverState.properties.scale = 1.4;

            series.tooltip.pointerOrientation = "down";
            series.tooltip.getStrokeFromObject = true;
            series.tooltip.getFillFromObject = false;
            series.tooltip.background.fillOpacity = 0.2;
            series.tooltip.background.fill = am4core.color("#000000");
            series.tooltip.dy = -4;
            series.tooltip.fontSize = "0.8em";
            series.tooltipText = "Total {name}: {valueY}";

            return series;
        }


        line.legend = new am4charts.Legend();
        line.legend.parent = line.plotContainer;
        line.legend.labels.template.fill = am4core.color("#525252");
        line.legend.markers.template.height = 8;
        line.legend.contentAlign = "left";
        line.legend.itemContainers.template.valign = "middle";
        let legendDown = false;
        line.legend.itemContainers.template.events.on("down", function() {
            legendDown = true;
        })
        line.legend.itemContainers.template.events.on("up", function() {
            setTimeout(function() {
                legendDown = false;
            }, 100)
        })


        line.cursor = new am4charts.XYCursor();
        line.cursor.maxTooltipDistance = 0;
        line.cursor.behavior = "none";
        line.cursor.lineY.disabled = true;
        line.cursor.lineX.stroke = activeColor;
        line.cursor.xAxis = dateAxis;
        am4core.getInteraction().body.events.off("down", line.cursor.handleCursorDown, line.cursor)
        am4core.getInteraction().body.events.off("up", line.cursor.handleCursorUp, line.cursor)



        //----------------------------------
        chart.current = line;
        return () => {
            line.dispose();
        };
    }, []);


    return (
        <div id="chartplotdiv" style={{width: "100%", height: "500px"}}/>
    );
}


export default ComChart;
