

module.exports= {

    authHandler : (job, email, password) => {
        let procedure = "CALL authHandler("+
            "'" + job + "'"+
            ", '" + email + "'"+
            ", '" + password + "'"+
            ")"

        return procedure
    }
}