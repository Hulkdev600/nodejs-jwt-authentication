

module.exports= {

    authHandler : (job, email, password, name='') => {
        let procedure = "CALL authHandler("+
            "'" + job + "'"+
            ", '" + email + "'"+
            ", '" + password + "'"+
            ", '" + name + "'"+
            ")"

        return procedure
    }
}