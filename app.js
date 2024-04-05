const express = require('express');

const app = express();

const db = require('./models');

const { Member } = db;  


app.use(express.json());    

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if(team){
    const teamMembers = await Member.findAll({where: { team }});
    res.send(teamMembers);
  } else {
    const members = await Member.findAll();
    res.send(members);
  }
});

app.get('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findOne({where: {id}});

    if(member) {
        res.send(member);
    } else {
        res.status(404).send({message: 'Member not found'});
    }
});

app.post('/api/members', async (req, res) => {
    const newMember = req.body;
    
    // const member = await Member.create(newMember); 밑에 두줄과 같은 코드
    const member = await Member.build(newMember);
    await member.save();
    res.send(member);
});

// app.put('/api/members/:id', async (req, res) => {
//     const { id } = req.params;
//     const newMember = req.body;
//     const member = await Member.update(newMember, {where: {id}});

//     if(member[0]) {
//         res.send({message: `${member[0]} row(s) affected`});
//     } else {
//         res.status(404).send({message: 'Member not found'});
//     }
// });

app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newMember = req.body;
    const member = await Member.findOne({where: {id}});
    if(!member) {
        return res.status(404).send({message: 'Member not found'});
    }
    Object.keys(newMember).forEach((prop) => {
        member[prop] = newMember[prop];
    });
    await member.save();
    res.send(member);
});

app.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const deleteCount = await Member.destroy({where: {id}});
    if(deleteCount) {
        res.send({message: `${deleteCount} row(s) deleted`});
    } else {
        res.status(404).send({message: 'Member not found'});
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});