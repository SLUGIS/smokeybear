# First, update any changes that were made to the code
git pull origin gh-pages

# Run the script that updates the .xml for each station
echo getting new data...
python triplescraper.py
mv -f *.xml xml

# Update the "Last Updated" timestamps for each station
echo logging timestamps...
git log -1 --format=%ct -- xml/lapanza.xml > xml/timestamps
git log -1 --format=%ct -- xml/lastablas.xml >> xml/timestamps
git log -1 --format=%ct -- xml/arroyogrande.xml >> xml/timestamps
git log -1 --format=%ct -- xml/sansimeon.xml >> xml/timestamps

# Commit any changes that occurred
echo committing...
git add -A
git commit -m "Update adjective fire danger rating"
git push
