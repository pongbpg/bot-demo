export default (state = {
    admins: [],
    emails: [],
    teams: [],
    coms: [{ comId: '1', salary: 9800 }, { comId: '2', salary: 12000 }]
}, action) => {
    switch (action.type) {
        case 'SET_MANAGE_ADMINS':
            return {
                ...state,
                admins: action.admins
            }
        case 'SET_MANAGE_ADMIN':
            return {
                ...state,
                admins: state.admins.map(admin => {
                    if (admin.userId !== action.admin.userId) return admin
                    return { ...admin, ...action.admin }
                })
            }
        case 'SET_MANAGE_EMAILS':
            return {
                ...state,
                emails: action.emails
            }
        case 'SET_MANAGE_EMAIL':
            return {
                ...state,
                emails: state.emails.map(email => {
                    if (email.uid !== action.email.uid) return email
                    return { ...email, ...action.email }
                })
            }
        case 'PUSH_MANAGE_EMAIL':
            return {
                ...state,
                emails: [...state.emails, action.email]
            }
        case 'SET_MANAGE_TEAMS':
            return {
                ...state,
                teams: action.teams
            }
        case 'SET_MANAGE_TEAM':
            return {
                ...state,
                teams: state.teams.map(team => {
                    if (team.id !== action.team.id) return team
                    return { ...team, ...action.team }
                })
            }
        case 'PUSH_MANAGE_TEAM':
            return {
                ...state,
                teams: [...state.teams, action.team]
            }
        case 'REMOVE_MANAGE_TEAM':
            return {
                ...state,
                teams: state.teams.filter(team => team.id != action.team.id)
            }
        default:
            return state;
    }
};