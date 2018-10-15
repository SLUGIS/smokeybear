# First, update any changes that were made to the code
#git pull origin gh-pages
git pull origin smokeyTest

# Run the script that updates the .xml for each station
echo getting new data...
python triplescraper.py
mv -f *.xml xml2

# Update the "Last Updated" timestamps for each station
# Saving the xml folder for the old files that are currently working
#echo logging timestamps...
#git log -1 --format=%ct -- xml/lapanza.xml > xml/timestamps
#git log -1 --format=%ct -- xml/lastablas.xml >> xml/timestamps
#git log -1 --format=%ct -- xml/arroyogrande.xml >> xml/timestamps
#git log -1 --format=%ct -- xml/sansimeon.xml >> xml/timestamps

echo logging timestamps...
git log -1 --format=%ct -- xml2/lapanza.xml > xml2/timestamps
git log -1 --format=%ct -- xml2/lastablas.xml >> xml2/timestamps
git log -1 --format=%ct -- xml2/arroyogrande.xml >> xml2/timestamps
git log -1 --format=%ct -- xml2/sansimeon.xml >> xml2/timestamps
# Commit any changes that occurred
echo committing...
git add -A
git commit -m "Update adjective fire danger rating"
git push
