import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const NoteSkeleton = () => {
  return (
    <Card className="my-1">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-full h-10" />
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <Skeleton className="w-24 h-7" />
          </div>
          <Label className="flex items-center">
            <Skeleton className="w-32 h-7" />
          </Label>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteSkeleton;
