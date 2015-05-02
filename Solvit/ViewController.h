//
//  ViewController.h
//  Solvit
//
//  Created by Stuart Farmer on 5/2/15.
//  Copyright (c) 2015 Solvit. All rights reserved.
//

#import <AtkMaw/MAWMathWidget.h>
#import <UIKit/UIKit.h>

@interface ViewController : UIViewController <MAWMathViewControllerDelegate>

@property (strong, nonatomic) IBOutlet UIImageView *drawingBoard;

- (IBAction)clearPressed:(id)sender;

@end

