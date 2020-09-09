import "core-js";
import React, {useEffect, useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";


//сверху сделать конфиг с параметрами карты
am4core.useTheme(am4themes_animated);


const mainColor = am4core.color("#e8e8e8");
const confirmedColor = am4core.color("#1c5fe5");
const activeColor = am4core.color("#e2761e");
const recoveredColor = am4core.color("#45d21a");
const deathsColor = am4core.color("#d21a1a");
const colors = { confirmed: confirmedColor, active: activeColor,
    recovered: recoveredColor, deaths: deathsColor };


function ComMap(props) {
    const chart = useRef(null);
    const data = props.data;

    useEffect(() => {

        let container = am4core.create("chartmapdiv", am4core.Container);
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);
        container.layout = "vertical";


        let map = container.createChild(am4maps.MapChart);
        map.height = am4core.percent(100);

        map.geodata = am4geodata_worldLow;
        map.projection = new am4maps.projections.Miller();
        map.deltaLongitude = -8;

        map.zoomControl = new am4maps.ZoomControl();
        map.zoomControl.align = "right";
        map.zoomControl.marginRight = 15;
        map.zoomControl.valign = "middle";


        let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.exclude = ["AQ"];
        polygonSeries.useGeodata = true;

        polygonSeries.nonScalingStroke = true;
        polygonSeries.strokeWidth = 0.5;
        polygonSeries.interpolationDuration = 0;
        polygonSeries.data = data;
        polygonSeries.dataFields.id = "id";
        polygonSeries.dataFields.value = "confirmedPC";
        polygonSeries.calculateVisualCenter = true;


        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.fill = mainColor;
        polygonTemplate.stroke = am4core.color("#8b8b8b");
        polygonTemplate.setStateOnChildren = true;
        polygonTemplate.tooltipPosition = "fixed";

        polygonTemplate.events.on("over", handleCountryOver);
        polygonTemplate.events.on("out", handleCountryOut);

        let polygonHoverState = polygonTemplate.states.create("hover");
        polygonHoverState.transitionDuration = 500;
        polygonHoverState.properties.fill = am4core.color("#999999");

        //---------------------------------------------
        polygonSeries.heatRules.push({ //правила покраски для тепловой карты
            "target": polygonTemplate,
            "property": "fill",
            "min": mainColor,
            "max": mainColor,
            "dataField": "value"
        })




        let bubbleSeries = map.series.push(new am4maps.MapImageSeries());
        bubbleSeries.data = data;
        bubbleSeries.dataFields.value = "confirmed";
        bubbleSeries.dataFields.id = "id";

        let imageTemplate = bubbleSeries.mapImages.template;
        imageTemplate.nonScaling = true;
        imageTemplate.fillOpacity = 0.6;
        imageTemplate.strokeOpacity = 0;
        imageTemplate.applyOnClones = true;

        imageTemplate.events.on("over", handleImageOver);
        imageTemplate.events.on("out", handleImageOut);

        let imageHoverState = imageTemplate.states.create("hover");
        imageHoverState.properties.fillOpacity = 1;



        bubbleSeries.tooltip.animationDuration = 0;
        bubbleSeries.tooltip.showInViewport = false;
        bubbleSeries.tooltip.background.fillOpacity = 0.2;
        bubbleSeries.tooltip.getStrokeFromObject = true;
        bubbleSeries.tooltip.getFillFromObject = false;
        bubbleSeries.tooltip.background.fillOpacity = 0.2;
        bubbleSeries.tooltip.background.fill = am4core.color("#000000");

        imageTemplate.adapter.add("tooltipY", function(tooltipY, target) {
            return -target.children.getIndex(0).radius;
        })



        let circle = imageTemplate.createChild(am4core.Circle);
        circle.applyOnClones = true;
        circle.hiddenState.properties.scale = 0.0001;
        circle.hiddenState.transitionDuration = 2000;
        circle.defaultState.transitionDuration = 2000;
        circle.defaultState.transitionEasing = am4core.ease.elasticOut;

        bubbleSeries.heatRules.push({
            "target": circle,
            "property": "radius",
            "min": 3,
            "max": 10,
            "dataField": "value"
        })

        bubbleSeries.events.on("dataitemsvalidated", function() {
            bubbleSeries.dataItems.each((dataItem) => {
                let mapImage = dataItem.mapImage;
                let circle = mapImage.children.getIndex(0);
                if (mapImage.dataItem.value === 0) {
                    circle.hide(0);
                }
                else if (circle.isHidden || circle.isHiding) {
                    circle.show();
                }
            })
        })

        imageTemplate.adapter.add("latitude", function(latitude, target) {
            let polygon = polygonSeries.getPolygonById(target.dataItem.id);
            if (polygon) {
                target.disabled = false;
                return polygon.visualLatitude;
            }
            else {
                target.disabled = true;
            }
            return latitude;
        })
        imageTemplate.adapter.add("longitude", function(longitude, target) {
            let polygon = polygonSeries.getPolygonById(target.dataItem.id);
            if (polygon) {
                target.disabled = false;
                return polygon.visualLongitude;
            }
            else {
                target.disabled = true;
            }
            return longitude;
        })



        //===========================================================

        let absolutePerCapitaSwitch = map.createChild(am4core.SwitchButton);
        absolutePerCapitaSwitch.align = "right"
        absolutePerCapitaSwitch.y = 15;
        absolutePerCapitaSwitch.leftLabel.text = "Absolute";
        absolutePerCapitaSwitch.rightLabel.text = "Per Capita";
        absolutePerCapitaSwitch.leftLabel.fill = am4core.color("#000000");
        absolutePerCapitaSwitch.rightLabel.fill = am4core.color("#000000");
        absolutePerCapitaSwitch.rightLabel.interactionsEnabled = true;
        absolutePerCapitaSwitch.verticalCenter = "top";

        let perCapita = false;

        absolutePerCapitaSwitch.events.on("toggled", function() {
            if (absolutePerCapitaSwitch.isActive) {
                bubbleSeries.hide(0);
                perCapita = true;
                bubbleSeries.interpolationDuration = 0;
                polygonSeries.heatRules.getIndex(0).max = colors[currentType];
                polygonSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
                polygonSeries.mapPolygons.template.applyOnClones = true;
                updateCountryTooltip();

            } else {
                perCapita = false;
                polygonSeries.interpolationDuration = 0;
                bubbleSeries.interpolationDuration = 1000;
                bubbleSeries.show();
                polygonSeries.heatRules.getIndex(0).max = mainColor;
                polygonSeries.mapPolygons.template.tooltipText = undefined;
            }
            polygonSeries.mapPolygons.each(function(mapPolygon) {
                mapPolygon.fill = mapPolygon.fill;
                mapPolygon.defaultState.properties.fill = undefined;
            })
        })

        //********************************************************

        function updateCountryTooltip() {
            polygonSeries.mapPolygons.template.tooltipText = "[bold]{name}: {value.formatNumber('#.')}[/]\n[font-size:10px]" + currentTypeName + " per million"
        }

        function handleCountryOver(event) {
            rollOverCountry(event.target);
        }

        function handleCountryOut(event) {
            rollOutCountry(event.target);
        }

        function handleImageOver(event) {
            rollOverCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
        }

        function handleImageOut(event) {
            rollOutCountry(polygonSeries.getPolygonById(event.target.dataItem.id));
        }


        function rollOverCountry(mapPolygon) {

            resetHover();
            if (mapPolygon) {
                mapPolygon.isHover = true;

                let image = bubbleSeries.getImageById(mapPolygon.dataItem.id);
                if (image) {
                    image.dataItem.dataContext.name = mapPolygon.dataItem.dataContext.name;
                    image.isHover = true;
                }
            }
        }

        function rollOutCountry(mapPolygon) {
            let image = bubbleSeries.getImageById(mapPolygon.dataItem.id)

            resetHover();
            if (image) {
                image.isHover = false;
            }
        }

        function resetHover() {
            polygonSeries.mapPolygons.each(function(polygon) {
                polygon.isHover = false;
            })

            bubbleSeries.mapImages.each(function(image) {
                image.isHover = false;
            })
        }



        //-----------buttons

        let currentType;
        let currentTypeName;
        let max = { confirmed: 0, recovered: 0, deaths: 0, active: 0 };
        let maxPC = { confirmed: 0, recovered: 0, deaths: 0, active: 0 };

        for (let i = 0; i < data.length; i++) {
            let di = data[i];
            if (di.confirmed > max.confirmed) {
                max.confirmed = di.confirmed;
            }
            if (di.recovered > max.recovered) {
                max.recovered = di.recovered;
            }
            if (di.deaths > max.deaths) {
                max.deaths = di.deaths;
            }
            if (di.active > max.active) {
                max.active = di.active;
            }

            if (di.confirmedPC > maxPC.confirmed) {
                maxPC.confirmed = di.confirmedPC;
            }
            if (di.recoveredPC > maxPC.recovered) {
                maxPC.recovered = di.recoveredPC;
            }
            if (di.deathsPC > maxPC.deaths) {
                maxPC.deaths = di.deathsPC;
            }
            if (di.activePC > maxPC.active) {
                maxPC.active = di.activePC;
            }
        }

        console.log('max = ', maxPC);

        let bottomContainer = container.createChild(am4core.Container);


        bottomContainer.height = am4core.percent(45); // make this bigger if you want more space for the chart
        bottomContainer.width = am4core.percent(100);
        bottomContainer.valign = "bottom";
        bottomContainer.width = am4core.percent(100);
        bottomContainer.padding(0, 10, 5, 20);
        bottomContainer.layout = "horizontal";

        let buttonsContainer = bottomContainer.createChild(am4core.Container);
        buttonsContainer.layout = "grid";
        buttonsContainer.width = am4core.percent(100);
        buttonsContainer.x = 10;
        buttonsContainer.contentAlign = "right";


        let confirmedButton = newButton("confirmed", confirmedColor);
        let activeButton = newButton("active", activeColor);
        let recoveredButton = newButton("recovered", recoveredColor);
        let deathsButton = newButton("deaths", deathsColor);

        let buttons = { active: activeButton, confirmed: confirmedButton, recovered: recoveredButton, deaths: deathsButton };
        changeDataType("confirmed");


        //----------funcs for buttons
        function newButton(name, color) {
            let button = buttonsContainer.createChild(am4core.Button)
            button.label.valign = "middle"
            button.label.fill = am4core.color("#000000");

            button.background.cornerRadius(30, 30, 30, 30);
            button.background.strokeOpacity = 0.3
            button.background.fillOpacity = 0;
            button.background.stroke =  am4core.color("#000000");
            button.background.padding(2, 3, 2, 3);
            button.states.create("active");
            button.setStateOnChildren = true;

            button.label.fontSize = "15px";
            button.label.text = name;
            button.marginRight = 15;

            let activeHoverState = button.background.states.create("hoverActive");
            activeHoverState.properties.fillOpacity = 0;

            let circle = new am4core.Circle();
            circle.radius = 8;
            circle.fillOpacity = 0.3;
            circle.fill =  am4core.color("#727272");
            circle.strokeOpacity = 0;
            circle.valign = "middle";
            circle.marginRight = 5;
            button.icon = circle;
            button.typeName = name;
            button.events.on("hit", handleButtonClick);

            let circleActiveState = circle.states.create("active");
            circleActiveState.properties.fill = color;
            circleActiveState.properties.fillOpacity = 0.5;

            return button;
        }

        function handleButtonClick(event) {
            changeDataType(event.target.typeName);
        }


        function changeDataType(name) {
            currentType = name;
            currentTypeName = name;
            if (name !== "deaths") {
                currentTypeName += " cases";
            }
            bubbleSeries.mapImages.template.tooltipText = "[bold]{name}: {value}[/] [font-size:10px]\n" + currentTypeName;

            let activeButton = buttons[name];
            activeButton.isActive = true;
            for (let key in buttons) {
                if (buttons[key] !== activeButton) {
                    buttons[key].isActive = false;
                }
            }

            bubbleSeries.dataFields.value = name;
            polygonSeries.dataFields.value = name + "PC";

            bubbleSeries.dataItems.each(function(dataItem) {
                if (dataItem.dataContext[currentType]!==undefined) {
                }
                dataItem.setValue("value", dataItem.dataContext[currentType]);
            })

            polygonSeries.dataItems.each(function(dataItem) {
                dataItem.setValue("value", dataItem.dataContext[currentType + "PC"]);
                dataItem.mapPolygon.defaultState.properties.fill = undefined;
            })


            bubbleSeries.mapImages.template.fill = colors[name];
            bubbleSeries.mapImages.template.stroke = colors[name];
            bubbleSeries.mapImages.template.children.getIndex(0).fill = colors[name];

            bubbleSeries.heatRules.getIndex(0).maxValue = max[currentType];
            polygonSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
            if (perCapita) {
                polygonSeries.heatRules.getIndex(0).max = colors[name];
                updateCountryTooltip();
            }
        }


        chart.current = map;
        return () => {
            map.dispose();
        };
    }, []);

    return (
        <div id="chartmapdiv" style={{ width: "100%", height: "500px" }} />
    );
}

export default ComMap;
