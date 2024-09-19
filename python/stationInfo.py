import json
import pandas as pd
from pymongo import MongoClient
import argparse
import os


def connect_mongo(mongo_uri, db_name, collection_name):
    client = MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name ]
    return collection, client


def read_xlsx(file_path_xlsx):
    if not os.path.exists(file_path_xlsx):
        raise FileNotFoundError(f"Excel file not found: {file_path_xlsx}")

    df = pd.read_excel(file_path_xlsx)

    return df.to_dic(orient="records")


def read_json(file_path_json):

    if not os.path.exits(file_path_json):
        raise FileNotFoundError(f"JSON file not found: {file_path_json}")
    
    with open(file_path_json, 'r') as file:
         return json.load(file)
     

def seed_data_to_mongodb(collection, data_to_insert):
    collection.insert_many(data_to_insert)


def main():
    parser = argparse.ArgumentParser(description="Seed station data into MongoDB.")
    
    parser.add_argument('--mongo_uri', type=str, required=True,
                                     help="MongoDb connection string(e.g., mongodb://localhost:27017/")
    parser.add_argument('--db_name', type=str, required=True,
                        help="Database name (e.g., Station)")
    parser.add_argument('--collection_name', type=str, required=True, 
                        help='Collection name (e.g. Station)')
    parser.add_argument('--xlsx_file', type=str, required=True,
                        help='Path to Excel file containing fuel price data')
    parser.add_argument('--json_file', type=str, required=True,
                        help='Path to JSON file containing station data')

    args = parser.parse_args()
    
    try:
        collection, client= connect_to_mongo(args.mongo_uri, args.db_name, args.collection_name)
        print(f"Connected to MongoDB at {args.mongo_uri}, database: {args.db_name}, collection name:{args.collection_name}")
        
        data_from_xlsx = read_xlsx(args.xlsx_file)
        json_data = read_json(args.json_file)
        stations_array = json_data.get('stations', [])
        
        fuel_price_mapping = {record['Station Name']: record['Fuel Price'] for record in data_from_xlsx}
        
        array_to_mongodb = []
        for station in stations_array:
            name = station.get('name')
            
            data_to_mongodb = {
                "name": name,
                "address": station.get('address'),
                "suburb": station.get('suburb'),
                "city": station.get('city'),
                "region": station.get('region'),
                "postcode": station.get('postcode'),
                "latitude": station.get('latitude'),
                "longitude": station.get('longitude'),
                "type": station.get('type'),
                "openingHours": station.get('openingHours'),
                "special_fuel_Type": station.get('fuels'),
                "services": station.get('services'),
                "fuelPrice": fuel_price_mapping.get(name, [])
            }

            array_to_mongodb.append(data_to_mongodb)
        
        seed_data_to_mongodb(collection, array_to_mongodb)
        print(f"Successfully inserted {len(array_to_mongodb)} records into MongoDB")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == '__main__':
    main()