export const MONGO_QUERY_005 = [
    {
        $sort: {
            fecha: -1
        }
    },
    {
        $group: {
            _id: "$identificador",
            "tienda-api": {
            "$first": "$$ROOT"
            }
        }
    },
    {
        $match: {
            "tienda-api.evento": {
            $ne: "Delete"
            }
        }
    },
    {
        $project: {
            _id: 0,
            "tienda-api": 1
            
        }
    }
]