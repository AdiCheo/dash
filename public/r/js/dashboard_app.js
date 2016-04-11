// Welcome to the RazorFlow Dashbord Quickstart. Simply copy this "dashboard_quickstart"
// to somewhere in your computer/web-server to have a dashboard ready to use.
// This is a great way to get started with RazorFlow with minimal time in setup.
// However, once you're ready to go into deployment consult our documentation on tips for how to 
// maintain the most stable and secure 

StandaloneDashboard(function(tdb){
	tdb.setTabbedDashboardTitle("Tabbed Dashboard");
	var db1 = new Dashboard();
	
	db1.setDashboardTitle('Table In Razorfow');

    var c1 = new TableComponent();
    c1.setDimensions(12, 6);
    c1.setCaption('List of items in stock');
    c1.addColumn('ProductID', 'Product ID');
    c1.addColumn('ProductName', 'Product Name');
    c1.addColumn('CategoryName', 'Category');
    c1.addColumn('UnitPrice', 'Price', {
        dataType: "number",
        numberPrefix: "$",
        numberForceDecimals: true,
        numberDecimalPoints: 2
    });
    c1.addColumn('UnitsInStock', 'Stock', {
        dataType: "number"
    });
    c1.addColumn('Discontinued', 'Discontinued?');
    // c1.lock();
    db1.addComponent(c1);

    // $.ajax({
    //     url: '/static/fixtures/products.json',
    //     type: 'GET',
    //     success: function(products) {
    //         if (_.isString(products)) {
    //             products = JSON.parse(products);
    //         }
    //         for(var i=-1; ++i<products.length;) {
    //             c1.addRow(products[i], {});
    //         }
    //         c1.unlock();
    //     }
    // });
    
	var db = new Dashboard();
	db.setDashboardTitle ("My Dashboard");

	// Add a chart to the dashboard. This is a simple chart with no customization.
	var chart_a0 = new ChartComponent();
	chart_a0.setCaption("Sales");
	chart_a0.setDimensions (6, 6);	
	chart_a0.setLabels (["2013", "2014", "2015"]);
	chart_a0.addSeries ([3151, 1121, 4982]);
	db.addComponent (chart_a0);

	// You can add multiple charts to the same dashboard. In fact you can add many 
	// different types of components. Check out the docs at razorflow.com/docs 
	// to read about all the types of components.
	// 
	// This is another chart with additional parameters passed to "addSeries" to 
	// make customizations like change it to a line chart, and add "$" to indicate currency
	var chart2 = new ChartComponent();
	chart2.setCaption("Sales");
	chart2.setDimensions (6, 6);	
	chart2.setLabels (["2013", "2014", "2015"]);
	chart2.addSeries ([3151, 1121, 4982], {
		numberPrefix: "$",
		seriesDisplayType: "line"
	});
	db.addComponent (chart2);
	
	
    var kpi = new GaugeComponent ();
    kpi.setDimensions (4, 3);
    kpi.setCaption ("Current server load. In %");
    kpi.setLimits (0, 100);
    kpi.setValue (Math.floor((Math.random() * 10)) + 40);

    db.addComponent(kpi);


    var chart_a1 = new ChartComponent("hashtags");
	chart_a1.setDimensions (8, 6);
	chart_a1.setCaption("Number of tweets on top 5 hashtags");
	chart_a1.setLabels (["#android", "#ipad", "#news", "#salute", "#nowplaying"]);
	chart_a1.addSeries ("tweets", "No. of tweets", [220, 240, 218, 218, 246]);
	chart_a1.setYAxis("", {numberHumanize: true});
	db.addComponent (chart_a1);

	db.setInterval(function () {
		kpi.setValue(Math.floor((Math.random() * 10)) + 40);
        var data = [];
        for(var i = 0; i < 5; i++) {
            data.push(Math.floor((Math.random() * 200)) + 200);
        }
        chart_a1.updateSeries ("tweets", data);
    }, 1500);
    
    var chart_a3 = new ChartComponent("sales");
    chart_a3.setDimensions (8, 6);
    chart_a3.setCaption("Sales - 2013 vs 2012");
    chart_a3.setLabels (["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]);
    chart_a3.addSeries ("sales2013", "2013", [22400, 24800, 21800, 21800, 24600, 27600, 26800, 27700, 23700, 25900, 26800, 24800]);
    chart_a3.addSeries ("sales2012", "2012", [10000, 11500, 12500, 15000, 16000, 17600, 18800, 19700, 21700, 21900, 22900, 20800]);
    chart_a3.setYAxis("Sales", {numberPrefix: "$", numberHumanize: true});
    chart_a3.addComponentKPI ("max2012", {
        caption: "Maximum sales in 2012",
        value: 22900,
        numberPrefix: " $",
        numberHumanize: true
    });

    chart_a3.addComponentKPI("min2012", {
        caption: "Lowest sales in 2012",
        value: 10000,
        numberPrefix: " $",
        numberHumanize: true
    });

    chart_a3.addComponentKPI("max2013", {
        caption: "Maximum sales in 2013",
        value: 27700,
        numberPrefix: " $",
        numberHumanize: true
    });

    chart_a3.addComponentKPI("min2013", {
        caption: "Lowest sales in 2013",
        value: 21800,
        numberPrefix: " $",
        numberHumanize: true
    });

    db.addComponent (chart_a3);
    
    var chart_a4 = new ChartComponent ("chart");
    chart_a4.setDimensions (8, 6);
    chart_a4.setCaption ("Annual Sales Summary (2010 - 2013)");
    chart_a4.setLabels (["2010", "2011", "2012", "2013"]);
    chart_a4.addSeries ("sales", "Sales", [1160000, 1040000, 1020000, 1160000]);

    chart_a4.setYAxis("Sales", {
        numberPrefix: "$",
        numberHumanize: true
    });

    var selectedYear;
    var labelsForQuarters = {
        "Q1": ["January", "February", "March"],
        "Q2": ["April", "May", "June"],
        "Q3": ["July", "August", "September"],
        "Q4": ["October", "November", "December"]
    };
    var yearData = {
        "2010": {
            "Q1": [110000, 76000, 88000],
            "Q2": [116000, 92000, 62000],
            "Q3": [114000, 86000, 11800],
            "Q4": [92000, 102000, 105000],
            data:  [274000, 270000, 318000, 299000]
        },
        "2011": {
            "Q1": [370000, 290000, 320000],
            "Q2": [370000, 290000, 320000],
            "Q3": [370000, 290000, 320000],
            "Q4": [370000, 290000, 320000],
            data: [306000, 203000, 270000, 264000]
        },
        "2012": {
            "Q1": [87000, 89000, 65000],
            "Q2": [13000, 44000, 106000],
            "Q3": [85000, 103000, 67000],
            "Q4": [59000, 69000, 113000],
            data: [241000, 280000, 255000, 241000]
        },
        "2013": {
            "Q1": [105000, 76000, 88000],
            "Q2": [116000, 92000, 62000],
            "Q3": [114000, 86000, 118000],
            "Q4": [92000, 102000, 105000],
            data: [269000, 270000, 318000, 299000]
        }
    }

    chart_a4.addDrillStep (function (done, params, updatedComponent) {
        var label = selectedYear = params.label;
        updatedComponent.setLabels (["Q1", "Q2", "Q3", "Q4"]);
        updatedComponent.addSeries ("sales", "Sales", yearData[label].data);
        done();
    });

    chart_a4.addDrillStep (function (done, params, updatedComponent) {
        var label = params.label;
        updatedComponent.setLabels (labelsForQuarters[label]);
        updatedComponent.addSeries ("sales", "Sales", yearData[selectedYear][label]);
        done();
    });

    db.addComponent (chart_a4);
    
    var form_x = new FormComponent ();
    form_x.setDimensions (8, 6);
    form_x.setCaption ("Form items in stock");
    form_x.addSelectField ("category", "Select Category", ["No Selection", "Beverages", "Condiments", "Confections", "Dairy Products", "Grains/Cereal", "Meat/Poultry", "Produce", "Seafood"]);
    form_x.addTextField ("contains", "Product Name Contains");
    form_x.addNumericRangeField("stock", "Units In Stock");
    form_x.addCheckboxField("discontinued", "Exclude Discontinued Items", false);
    db.addComponent(form_x);
    var table = new TableComponent ();
    table.setDimensions (12, 7);
    table.setCaption ("Change caption to IMDB Top 20 Movies");
    table.addColumn ("rank", "Rank");
    table.addColumn ("title", "Title");
    table.addColumn ("year", "Year");
    table.addColumn ("rating", "IMDB Rating");

    table.addRow ({
        "rank": 1,
        "title": "The Shawshank Redemption",
        "year": "1994",
        "rating": 9.2
    });

    table.addRow ({
        "rank": 2,
        "title": "The Godfather",
        "year": "1972",
        "rating": 9.2
    });

    table.addRow ({
        "rank": 3,
        "title": "The Godfather part II",
        "year": "1974",
        "rating": 9.0
    });

    table.addRow ({
        "rank": 4,
        "title": "The Dark Knight",
        "year": "2008",
        "rating": 8.9
    });

    table.addRow ({
        "rank": 5,
        "title": "Pulp Fiction",
        "year": "1994",
        "rating": 8.9
    });

    table.addRow ({
        "rank": 6,
        "title": "The Good, the Bad and the Ugly",
        "year": "1966",
        "rating": 8.9
    });

    table.addRow ({
        "rank": 7,
        "title": "Schindler\"s List",
        "year": "1993",
        "rating": 8.9
    });

    table.addRow ({
        "rank": 8,
        "title": "Angry Men",
        "year": "1957",
        "rating": 8.9
    });

    table.addRow ({
        "rank": 9,
        "title": "The Lord of the Rings: The Return of the King",
        "year": "2003",
        "rating": 8.9
    });

    table.addRow ({
        "rank": 10,
        "title": "Fight Club",
        "year": "1999",
        "rating": 8.8
    });

    table.addRow ({
        "rank": 11,
        "title": "The Lord of the Rings: The Fellowship of the Ring",
        "year": "2001",
        "rating": 8.8
    });

    table.addRow ({
        "rank": 12,
        "title": "Star Wars: Episode V - The Empire Strikes Back",
        "year": "1980",
        "rating": 8.8
    });

    table.addRow ({
        "rank": 13,
        "title": "Inception",
        "year": "2010",
        "rating": 8.7
    });

    table.addRow ({
        "rank": 14,
        "title": "Forrest Gump",
        "year": "1994",
        "rating": 8.7
    });

    table.addRow ({
        "rank": 15,
        "title": "One Flew Over the Cuckoo\"s Nest",
        "year": "1975",
        "rating": 8.7
    });

    table.addRow ({
        "rank": 16,
        "title": "The Lord of the Rings: The Two Towers",
        "year": "2002",
        "rating": 8.7
    });

    table.addRow ({
        "rank": 17,
        "title": "Goodfellas",
        "year": "1990",
        "rating": 8.7
    });

    table.addRow ({
        "rank": 18,
        "title": "Star Wars: Episode IV - A New Hope",
        "year": "1977",
        "rating": 8.7
    });

    table.addRow ({
        "rank": 19,
        "title": "The Matrix",
        "year": "1999",
        "rating": 8.7
    });

    table.addRow ({
        "rank": 20,
        "title": "Seven Samurai",
        "year": "1954",
        "rating": 8.7
    });

    db.addComponent(table);
    
    var kpi_a0 = new KPIGroupComponent ();
    kpi_a0.setDimensions (12, 2);
    kpi_a0.setCaption("Available food items in the warehouse");

    kpi_a0.addKPI("beverages", {
        caption: "Beverages",
        value: 559,
        numberSuffix: " units"
    });

    kpi_a0.addKPI("condiments", {
        caption: "Condiments",
        value: 507,
        numberSuffix: " units"
    });

    kpi_a0.addKPI("confections", {
        caption: "Confections",
        value: 386,
        numberSuffix: " units"
    });

    kpi_a0.addKPI("daily_products", {
        caption: "Daily Products",
        value: 393,
        numberSuffix: " units"
    });
    db.addComponent (kpi_a0);
    
    var chart_a5 = new ChartComponent();
    chart_a5.setDimensions (8, 6);
    chart_a5.setYAxis("Sales", {
        numberPrefix: "$ ",
        numberHumanize: true
    });
    chart_a5.addYAxis("profit", "Profit %", {
        numberSuffix: "%"
    });
    chart_a5.setCaption("Showing monthly sales and profit of a retail company");    
    chart_a5.setLabels (["March", "April", "May", "June", "July"]);
    chart_a5.addSeries ("product_A", "Product A", [25601.34, 20148.82, 17372.76, 35407.15, 38105.68], {
        numberPrefix: "$",
        seriesDisplayType: "column"
    });
    chart_a5.addSeries ("product_B", "Product B", [57401.85, 41941.19, 45263.37, 117320.16, 114845.27], {
        numberPrefix: "$",
        seriesDisplayType: "column"
    });
    chart_a5.addSeries ("profit", "Profit %", [20, 42, 10, 23, 16], {
        numberSuffix: "%",
        seriesDisplayType: "line",
        yAxis: "profit"
    });
    db.addComponent (chart_a5);
    
    var chart_a6 = new ChartComponent();
	chart_a6.setDimensions (6, 4);
	chart_a6.setCaption("Company Revenue and Profits");
	chart_a6.setLabels (["Aug", "Sept", "Oct", "Nov", "Dec"]);
	chart_a6.addSeries ("revenue", "Revenue", [20000, 17000, 22000, 19000, 23000], {
		numberPrefix: "$"
	});
	chart_a6.addYAxis("profit", "Profit %", {
		numberSuffix: "%"
	});
	chart_a6.addSeries ("profit", "Profit %", [25, 5.88, 36.36, 10.52, 30.43], {
		numberSuffix: "%",
		yAxis: "profit",
		seriesDisplayType: "line"
	});

	chart_a6.setYAxis("Revenue", {numberPrefix: "$", numberHumanize: true});
	db.addComponent (chart_a6);


	var chart_a61 = new ChartComponent();
	chart_a61.setDimensions (6, 4);
	chart_a61.setCaption("Company Sales");
	chart_a61.setLabels (["Jan", "Feb", "Mar", "Apr", "May", "June"]);
	chart_a61.addSeries ("Revenue", "Revenue", [5854, 4171, 1375, 1875, 2246, 2696]);
	chart_a61.addSeries ("Profit", "Profit", [3242, 3171, 700, 1287, 1856, 1126], {
		seriesDisplayType: "area"
	});
	chart_a61.addSeries ("Predicted_Profit", "Predicted Profit", [4342, 2371, 740, 3487, 2156, 1326], {
		seriesDisplayType: "line"
	});
	chart_a61.setYAxis("Sales", {numberPrefix: "$", numberHumanize: true});
	db.addComponent (chart_a61);
	
  tdb.addDashboardTab(db1, {
        title: 'Table Dashboard'
    });
  tdb.addDashboardTab(db, {
        active: true
    });

}, {tabbed: true});