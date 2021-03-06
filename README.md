
#Solvit iOS Application

#####Current version name: Velma

![Velma](http://upload.wikimedia.org/wikipedia/en/9/9d/Velma_Dinkley.png)

######Current features implemented:
* Stroke object nativized from JSON format
* Drawing works
* Strokes are tallied up into an app wide array

######Future features:
* Sending data to the Solvit app
* Getting an API response from the Solvit app
* Calculating row height, possibly dynamically from slashing horizontally across the screen (fancy)

######Problems:
* MyScript doesn't play nice
* Difficulties running recognition on symbols that do not strictly use the MAWMathViewController
* Calculations to run CDK and parse JSON through networking calls reveal costing us $0.07 per line
* ATK is horrible
* SDK requires inquiry

:clap::clap::clap:

##Objects

###SLVStroke

SLVStroke is the native Objective-C object that represents the 'stroke' JSON object that's required for the Solvit API. SLVStroke contains four objects:

```
@property (strong, nonatomic) NSString *type;
@property (nonatomic) int row;
@property (strong, nonatomic) NSMutableArray *x;
@property (strong, nonatomic) NSMutableArray *y;
```

These four objects correlate directly to the JSON format that Solvit uses to determine what a stroke is on the web application:

```
stroke = {
	"type":"stroke",
	"row": startRow,
    "x" : [x],
    "y" : [y]
}; 
```

SLVStroke objects are always initialized with the 'type' property as "stroke".
