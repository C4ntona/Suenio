export const MONGO_QUERY_003 = [
    {
        $sort: {
            fecha: -1
        }
    },
    {
        $group: {
            _id: "$identificador",
            "personaje-api": {
            "$first": "$$ROOT"
            }
        }
    },
    {
        $match: {
            "personaje-api.evento": {
            $ne: "Delete"
            }
        }
    },
    {
        $project: {
            _id: 0,
            "personaje-api": 1
            
        }
    }
]