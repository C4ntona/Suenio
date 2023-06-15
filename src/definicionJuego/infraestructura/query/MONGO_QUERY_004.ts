export const MONGO_QUERY_004 = [
    {
        $sort: {
            fecha: -1
        }
    },
    {
        $group: {
            _id: "$identificador",
            "partida-api": {
            "$first": "$$ROOT"
            }
        }
    },
    {
        $match: {
            "partida-api.evento": {
            $ne: "Delete"
            }
        }
    },
    {
        $project: {
            _id: 0,
            "partida-api": 1
            
        }
    }
]