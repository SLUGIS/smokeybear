"""
Python script that scraps the adjective fire danger information
"""
#Changes by Jordan 10 / 8 / 18
#	1) Updated pip from 9.0.0 to 18.0.0, installed lxml
#	2) Switched from using urlopen (deprecated) to urllib.request.urlopen
#	3) Got the XML data to write to the file, using only lastablas data for the time being, but written in "windows-1252" format
#	4) Moving to index.js file now to work on updateSmokey() 
#	Additional Notes: 
#		example XML webpage we are querying: https://fam.nwcg.gov/wims/xsql/nfdrs.xsql?stn=44904&start=07OCT18&end=08OCT18&user=4e1
#Necessary Libraries
from bs4 import BeautifulSoup, NavigableString
#note: will find resources online that recommend urllib2 but this is an unsafe package.
#		Use urllib for future development.
import lxml
import urllib.request
import datetime
#for testing purposes, printing to terminal intermediate XML data
import sys

try:
    from urllib2 import urlopen
except ImportError:
    from urllib.request import urlopen # py3k

# Get the report for the current date
today = datetime.date.today()
todaysdate = today.strftime('%d') + today.strftime('%b').upper() + today.strftime('%y')

# Get the report for yesterday's date as well
yesterday = datetime.date.today() - datetime.timedelta(days=1)
yesterdaysdate = yesterday.strftime('%d') + yesterday.strftime('%b').upper() + yesterday.strftime('%y')

#lapanza = "44904"
#lastablas = "44914"
#arroyogrande = "44915"
#sansimeon = "44917"


url_lt = "https://fam.nwcg.gov/wims/xsql/nfdrs.xsql?stn=44904&start=" + yesterdaysdate + "&end=" + todaysdate + "&user=4e1"
print ("Getting Las Tablas data from %s", url_lt) 
#urllib.request.urlopen sends a GET request, specified: https://docs.python.org/3.0/library/urllib.request.html
soup_lt = BeautifulSoup((urllib.request.urlopen(url_lt)).read(), "lxml")
#temp_soup_lt = (urllib.request.urlopen(url_lt)).read()
#soup_lt = BeautifulSoup(temp_soup_lt, "lxml")



#sys.stdout.write(temp_soup_lt.decode("utf-8"))
#^ data is correctly getting pulled.... problem is below

url_lp = "https://fam.nwcg.gov/wims/xsql/nfdrs.xsql?stn=44914&start=" + yesterdaysdate + "&end=" + todaysdate + "&user=4e1"
print ("Getting La Panza data from %s", url_lp)
soup_lp = BeautifulSoup((urllib.request.urlopen(url_lp)).read(), "lxml")
#soup_lp = BeautifulSoup(urlopen(url_lp))


url_ag = "https://fam.nwcg.gov/wims/xsql/nfdrs.xsql?stn=44915&start=" + yesterdaysdate + "&end=" + todaysdate + "&user=4e1"
print ("Getting Arroyo Grande data from %s", url_ag) 
soup_ag = BeautifulSoup((urllib.request.urlopen(url_ag)).read(), "lxml")
#soup_ag = BeautifulSoup(urlopen(url_ag)) 

url_slc = "https://fam.nwcg.gov/wims/xsql/nfdrs.xsql?stn=44917&start=" + yesterdaysdate + "&end=" + todaysdate + "&user=4e1"
print ("Getting San Simeon data from %s", url_slc) 

soup_slc = BeautifulSoup((urllib.request.urlopen(url_slc)).read(), "lxml")
#soup_slc = BeautifulSoup(urlopen(url_slc))

# Remove unnecessary html tags to get clean xml
invalid_tags = ['html', 'body', '?xml version = \'1.0\' encoding = \'windows-1252\'?']


s = ""
for tag in invalid_tags:
	for match in soup_lt.findAll(tag):
		match.replaceWithChildren()
	for match in soup_lp.findAll(tag):
		match.replaceWithChildren()
	for match in soup_ag.findAll(tag):
		match.replaceWithChildren()
	for match in soup_slc.findAll(tag):
		match.replaceWithChildren()

"""
for tag in invalid_tags:
	for match in soup_lt.findAll(tag):
		match.replaceWithChildren()
	for match in soup_lp.findAll(tag):
		match.replaceWithChildren()
	for match in soup_ag.findAll(tag):
		match.replaceWithChildren()
	for match in soup_slc.findAll(tag):
		match.replaceWithChildren()
"""
# do not write the top line of the file, repeat this step on each page of xml
# doing this because I am unable to match against the <window> tag for some reason
lines = soup_lt.decode("windows-1252")
lines = lines.splitlines()
lines = lines[1:]
lines = "\n".join(lines)
with open("./xml2/lastablas.xml", "w") as file:
	file.write(lines)
	file.closed

lines = soup_lp.decode("windows-1252")
lines = lines.splitlines()
lines = lines[1:]
lines = "\n".join(lines)
with open("./xml2/lapanza.xml", "w") as file:
	file.write(lines)
	file.closed

lines = soup_ag.decode("windows-1252")
lines = lines.splitlines()
lines = lines[1:]
lines = "\n".join(lines)
with open("./xml2/arroyogrande.xml", "w") as file:
	file.write(lines)
	file.closed

lines = soup_slc.decode("windows-1252")
lines = lines.splitlines()
lines = lines[1:]
lines = "\n".join(lines)
with open("./xml2/sansimeon.xml", "w") as file:
	file.write(lines)
	file.closed
"""
OLD FORMAT BELOW, JUST INCASE
with open("sansimeon.xml", "wb") as file:
	file.write(bytes(soup_slc))
	file.closed
"""