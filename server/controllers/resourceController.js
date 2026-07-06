const db = require("../config/db");
async function getResource(req,res){

    try{
        const result = await db.query(
            'SELECT resource_id, item_name, category, quantity_available, unit FROM resources WHERE quantity_available>0 ORDER BY category'
        );
        res.status(200).json(result.rows);

    }catch(error){
        console.error("DATABASE CRASH DETAILS:", error);
        res.status(500).json({error: 'Server database error'});
    }

}

module.exports ={
    getResource
}