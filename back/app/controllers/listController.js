// ~ IMPORTATION
import { List } from '../models/index.js';
import errorAPI from './errorController.js';
import assert from 'assert';


// ~ FUNCTIONS
// ~ ------------------------------------------------ FETCH ALL LISTS
async function fetchAllLists(req, res) {

    try {

        const allLists = await List.findAll({
           
            attributes: {
                exclude: ['created_at', 'updated_at']
            },
            order: [
                ['order', 'ASC']
            ]
        });

        res.json(allLists);

    } catch (err) {
        errorAPI(err, req, res, 500);
    }
}

// ~ ------------------------------------------------ CREATE LIST

async function createList(req, res) {

    try {

        const { title, user_id } = req.body;
        
        //& ------------------------------------------------ create() + spread opérator

        assert.ok(title, `Le nom de la liste doit être précisé`);
        assert.ok(user_id, `L'utilisateur doit être identifié`);

        await List.create({ ...req.body });
        res.json(`La liste ${title} a bien été crée`);
        
    } catch (err) {
        errorAPI(err, req, res, 500);
    }
}

// ~ ------------------------------------------------ FETCH ONE LIST


async function fetchOneLIst(req, res) {
    
    try {
        const listId = Number(req.params.id);
        assert.ok(!isNaN(listId), `Please verify the provided id, it's not a number`)

        const list = await List.findByPk(listId,{
            attributes : ['title', 'description']
        });

        assert.ok(list, `Aucune liste n'a été trouvée !`);

        res.json(list);
        
    } catch (err) {
        errorAPI(err, req, res, 500);
    }

}

// ~ ------------------------------------------------ UPDATE LIST
async function updateList(req, res) {
    try {

        let {title, description, order, user_id} = req.body;
        const listId = Number(req.params.id);

        assert.ok(!isNaN(listId), `Please verify the provided id, it's not a number`)
        const listExist = await List.findOne({
            where: { id : listId }
        });

        assert.ok(listExist, `La liste n'existe pas`)


        await List.update(
            // l'ordre est important [values, conditions]
             { ...req.body },
             { where: { ...req.params } },
         );
         return res.json(`Les informations de la liste a bien été mise à jour !`);

    } catch (err) {
        errorAPI(err, req, res, 500);
    }
}


// ~ ------------------------------------------------ DELETE LIST
async function deleteList(req, res) {

    try {

        const listId = Number(req.params.id);
        assert.ok(!isNaN(listId), `Please verify the provided id, it's not a number`);
        const listExist = await List.findOne({
            where: { id : listId }
        });
        assert.ok(listExist, `La list n'existe pas`);

        await List.destroy({ where: { ...req.params } });
        res.json(`La liste a bien été supprimé !`);


    } catch (err) {
        errorAPI(err, req, res, 500);
    }
}

export { fetchAllLists, createList, fetchOneLIst, updateList, deleteList };



       

