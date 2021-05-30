#!/bin/sh
BRANCH_NAME=match-match-game
SCRIPT_PATH=$(
  cd $(dirname "$0")
  pwd
)
BUILD_FOLDER=$(
  cd $(dirname "${0}")/../build
  pwd
)

git switch gh-pages &&
git rm $BUILD_FOLDER/../* &&
git checkout $BRANCH_NAME -- $BUILD_FOLDER/ &&
mv $BUILD_FOLDER/* $BUILD_FOLDER/../ &&
rmdir $BUILD_FOLDER