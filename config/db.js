import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';


dotenv.config();
mongoose.set('strictQuery', false);

const DB = process.env.MONGODB_URL.replace(
    '<PASSWORD>',
    process.env.MONGODB_PASSWORD
);


const connect = async () => {
    try {
        await mongoose.connect(DB);
        console.log(`databse is connected`.bgMagenta.bgBlack);
    }
    catch (err) {
        throw (err)
    }
};


mongoose.connection.on('Disconnected', () => {
    console.log(`mongodb is disconnected`.bgCyan.bgBlack);
});


mongoose.connection.on('connected', () => {
    console.log(`mongodb is connected`.bgCyan.bgBlack);
})

export default connect;
