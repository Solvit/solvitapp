//
//  SLVStroke.h
//  Solvit
//
//  Created by Stuart Farmer on 5/2/15.
//  Copyright (c) 2015 Solvit. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SLVStroke : NSObject

@property (strong, nonatomic) NSString *type;
@property (nonatomic) int row;
@property (strong, nonatomic) NSMutableArray *x;
@property (strong, nonatomic) NSMutableArray *y;

@end
