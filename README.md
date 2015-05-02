#Solvit iOS Application

![Velma](http://en.wikipedia.org/wiki/Velma_Dinkley#/media/File:Velma_Dinkley.png)

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

