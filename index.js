const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('School Space server is running');
});

app.listen(port, () => {
    console.log('School Space server is listenning, ', port);
});


const uri = `mongodb+srv://SchoolSpace:JOkQrbBGdFG0ZQxX@jobtask.2dbil9p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// SchoolSpace
// JOkQrbBGdFG0ZQxX



async function run() {
    try{
        await client.connect();
        const studentCollection = client.db('StudentSpace').collection("studentCollection");
        
        //  load All Students records from database
        app.get('/students', async (req, res) => {
            const query = {};
            const cursor = studentCollection.find(query);
            const students = await cursor.toArray();
            res.send(students);
        });

         //  Adding student to database
         app.post('/add-student', async (req, res) => {
            const student = req.body;

            const result = await studentCollection.insertOne(student);
            res.send(result);

        });

        //  Updating student record
        app.put('/update-record/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStudent = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updatedStudent.name,
                    class: updatedStudent.class,
                    result: updatedStudent.result,
                    score: updatedStudent.score,
                    grade: updatedStudent.grade,
                },
            };

            const result = await studentCollection.updateOne(filter, updateDoc, options);
            
            res.send(result);
        });

         //  deleting student data from database
         app.delete('/delete-student/:_id', async (req, res) => {
            const _id = req.params._id;
            // console.log(id)
            const query = { _id: ObjectId(_id) };
            const result = await (studentCollection.deleteOne(query));
            res.send(result);
        })
    }
    finally{

    }

};

run().catch(console.dir);