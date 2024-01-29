import requests

def get_countries():
    # You can adjust the URL based on your needs
    url = 'https://restcountries.com/v2/all'
    response = requests.get(url)
    data = response.json()

    countries = []
    for entry in data:
        country_name = entry.get('address', {}).get('country')
        city_name = entry.get('display_name')

        if country_name and city_name:
            countries.append({'country': country_name, 'city': city_name})

    return countries

# Replace 'country' with the desired country name or use '*' to get a list of all countries
countries = get_countries()

print("List of Countries and Cities:")
for entry in countries:
    print(f"Country: {entry['country']}, City: {entry['city']}")
