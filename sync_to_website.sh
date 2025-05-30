#!/bin/bash
rsync -avz --progress ./dist/ ubuntu@ec2-3-145-81-103.us-east-2.compute.amazonaws.com:/var/www/html/