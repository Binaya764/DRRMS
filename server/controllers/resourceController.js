async function getResource(req,res){
    try{
        const result = await SecurityPolicyViolationEvent.query(
            'SELECT resource_id, item_name, category, quantity_availabe, unit FROM Resources WHERE quantity_availabe>0 ORDER BY category'
        );
        res.status(200).json(result.rows);

    }catch(err){
        res.status(500).json({error: 'Server database error'});
    }

}

module.exports ={
    getResource
}