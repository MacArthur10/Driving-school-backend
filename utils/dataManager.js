
const fs=require('fs');
const path=require('path');
const dataPath=path.join(__dirname,'../data');
function findAll(entity){
    const data=fs.readFileSync(path.join(dataPath,`${entity}.json`));
    return JSON.parse(data);
}
function find(entity,id){
    const data=fs.readFileSync(path.join(dataPath,`${entity}.json`));
    const entities=JSON.parse(data);
    return entities.find((entity)=>entity.id===id);
}
function create(entity,data){
    const entities=findAll(entity);
    const id=entities.length+1;
    const newEntity={id,...data};
    entities.push(newEntity);
    fs.writeFileSync(path.join(dataPath,`${entity}.json`),JSON.stringify(entities,null,2));
    return newEntity;
}
function update(entity,id,data){
    const entities=findAll(entity);
    const index=entities.findIndex((entity)=>entity.id===id);
    if(index!==-1){
        entities[index]={id,...data};
        fs.writeFileSync(path.join(dataPath,`${entity}.json`),JSON.stringify(entities,null,2));
        return entities[index];
    }
    return null;
}
function remove(entity,id){
    const entities=findAll(entity);
    const index=entities.findIndex((entity)=>entity.id===id);
    if(index!==-1){
        entities.splice(index,1);
        fs.writeFileSync(path.join(dataPath,`${entity}.json`),JSON.stringify(entities,null,2));
        return true;
    }
    return false;
}
module.exports={
    findAll,find,create,update,remove
}