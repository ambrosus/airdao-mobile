#!/bin/bash

# Step 1: Comment out /firebase/*
sed -i.bak 's|^/firebase/\*|#/firebase/\*|' .gitignore

# Step 2: Build for platform $1 and environment $2
# $1 is either android or ios
# $2 is one of dev, stage or prod
eas build -p $1 --profile $2


# Step 4: Uncomment /firebase/*
sed -i.bak 's|^#/firebase/\*|/firebase/\*|' .gitignore

# Remove backup file
rm .gitignore.bak
