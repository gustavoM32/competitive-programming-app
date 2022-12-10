// db.cfProblems.find();
db.problems.drop();
db.problemLists.drop();

function addUserData(ps, pls, user) {
	ps_copy = JSON.parse(JSON.stringify(ps))
	ps_copy.forEach(p => p.createdBy = user);

	let pids = db.problems.insertMany(ps_copy)["insertedIds"];

	pls_copy = JSON.parse(JSON.stringify(pls))
	pls_copy.forEach(pl => {
		pl.createdBy = user
		pl.problems = pl.problems.map(p => pids[p]);
	});

	db.problemLists.insertMany(pls_copy);
}


let ps = [
	{ "dateAdded" : ISODate("2022-12-02T13:43:34.000Z"), "name" : "Problema AA", "problemStatus" : "AC", "editorialStatus" : "READ_AFTER_AC", "comments" : "Levei 2 WAs por usar int ao invés de long long" },
	{ "dateAdded" : ISODate("2022-12-03T14:21:23.000Z"), "name" : "Problema B", "problemStatus" : "AC", "editorialStatus" : "READ_BEFORE_AC", "comments" : "Tive que ler o editorial pra descobrir que era uma PD" },
	{ "dateAdded" : ISODate("2022-12-04T13:56:06.000Z"), "name" : "Problema C", "problemStatus" : "WA", "editorialStatus" : "NOTHING", "comments" : "Tá dando TL, tem que otimizar um pouco mais" }
];


let pls = [
	{ "link" : "www.codeforces.com", "name" : "Lista 1", "description" : "Problemas de implementação", "notes" : "Vou deixar pra terminar depois que eu aprender segtree", "dateAdded" : ISODate("2022-12-02T15:43:12.000Z"), "solvedCount" : 0, "totalCount" : 2, "problems" : [0, 1] },
	{ "link" : "www.codeforces.com", "name" : "Lista 2", "description" : "Problemas do bixecamp", "notes" : "Tem alguns que eu não resolvi ainda", "dateAdded" : ISODate("2022-12-02T16:24:22.000Z"), "solvedCount" : 6, "totalCount" : 8, "problems" : [1, 2] }
]

addUserData(ps, pls, "gustavo_m32")
addUserData(ps, pls, "nathan_luiz")
addUserData(ps, pls, "Carlos_Eduardo_Ferreira")
