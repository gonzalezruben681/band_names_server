const Voter = require('./voter');

class VoterService {
    constructor() {}

    async checkVoter(voterId) {
        try {
            const voter = await Voter.findOne({ voterId });
            if (voter) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            throw new Error('Error en Voter checkVoter function');
        }
    }

    async createVoter(voterId, bandId) {
        try {
            const newVoter = new Voter({ voterId, bandId });
            await newVoter.save();
            return true;
        } catch (error) {
            console.log(error);
            throw new Error('Error en Voter createVoter function');
        }
    }
}
