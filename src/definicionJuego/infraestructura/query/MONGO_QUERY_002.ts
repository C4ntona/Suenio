export const MONGO_QUERY_002 = [
    {
        $sort: {
            fecha: -1
        }
    },
    {
        $group: {
            _id: "$identificador",
            "usuario-api": {
            "$first": "$$ROOT"
            }
        }
    },
    {
        $match: {
            "usuario-api.evento": {
            $ne: "Delete"
            }
        }
    },
    {
        $project: {
            _id: 0,
            "usuario-api": 1
            
        }
    }
]