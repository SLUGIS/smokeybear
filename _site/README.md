# **smokeybear**

## **Description**
This repo is the functionality behind the site located at http://slocountyfire.org/smokeybear/, which displays the Adjective Fire Rating for each area of SLO County based off the day's observations reports.

Originally featuring several smokeys for each area, as of 11/2017, smokey is now based off a dropdown.

## **Files**
#### **index.js**
"Code behind". Functions to parse xml files and event handlers for the drop down.

##### *Functions*
* *updateSmokey()*
    * Determines selected item from drop down, updates city/region on page and sends to processing.
* *getTimeStamps()*
    * Determines hours/minutes/seconds since last update, updates timestamp with that information based on city/region.
* *readJSON()*
    * Opens xml file, converts to JSON object, logic checks for certain information in logs, updates rating if found.

#### **index.html**
Start page featuring drop down list, description of Adjective Fire Rating, and history of AFR.

#### **triplescraper.py**
Python script to pull data from nwcg.gov.

#### **update_adj.sh**
Shell script to :
* Run triplescraper.py (pull reports from nwcg.gov)
* Sends data to /xml folder of project
* Pushes changes to git repo

#### **XML files under /xml**
These files are the daily observation reports that determine the Adjective Fire Rating, updated through update_adj.sh.


*Tags*
*jQuery, Ajax, Javacsript, Node, HTML*