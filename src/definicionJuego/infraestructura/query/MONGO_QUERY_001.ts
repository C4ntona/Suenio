import { QueryArgs } from "./QueryArgs"

export class MONGO_QUERY_001 extends QueryArgs {

    protected query: any = [
        {
            $sort: {
                fecha: -1
            }
        },
        {
            $group: {
                _id: "$identificador",
                "&collection": {
                "$first": "$$ROOT"
                }
            }
        },
        {
            $match: {
                "&collection.evento": {
                $ne: "Delete"
                }
            }
        },
        {
            $project: {
                _id: 0,
                "&collection": 1
                
            }
        }
    ]

}