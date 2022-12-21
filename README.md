# Why?
Infrastructure as code is quite handy when you need to scale your application demand. In this simple - by no means production ready code - Pulumi
is used to spin-up, configure and scale cloud resources on-demand and is tightly integrated in the code.
This project is used as reference implementation for a course I held with a colleague at "University of Applied Sciences Vienna".

# What?
This project is a very rough implementation of a video conversation pipeline which uses the AWS Cloud to transform videos on demand.
If you upload a video via the UI the video will get uploaded to a S3 bucket, once the video is there, an event gets published spinning up multiple AWS Fargate instances to:
1) generate a thumbnail
2) generate a video preview which is played on hover of the video element in the UI
3) generate dynamic thumbnails for the progress bar like YouTube/Netflix

As soon as all events have been processed, a new entry in a DynamoDB is created and the video is displayed in the UI.

# Improvements
- One could use the Amazon Elastic Transcoder to process the videos instead of AWS Fargate 
- Messages could be exchanged by Amazon Simple Queue Service
