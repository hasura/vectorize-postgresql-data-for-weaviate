def convert_data_types(properties):
    print(properties)
    valid_data_type_map = {
        "uuid": "text",
        "string": "text",
        "text": "text",
        "integer": "int",
        "float": "number",
        "timestamp with time zone": "text",
        "bool": "boolean",
        "datetime": "date",
        "phone_number": "phoneNumber",
        "url": "url",
    }

    converted_properties = []

    for prop in properties:
        prop_name = prop.get("name")
        data_type = prop.get("dataType")
        data_type = data_type[0]

        if data_type is None:
            raise ValueError(
                f"Property '{prop_name}' is missing the 'dataType' key.")

        converted_data_type = valid_data_type_map.get(data_type.lower())

        if converted_data_type is None:
            prop["dataType"] = [data_type]
        else:
            prop["dataType"] = [converted_data_type]
        converted_properties.append(prop)

    return converted_properties
