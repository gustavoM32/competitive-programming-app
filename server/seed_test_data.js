// db.cfProblems.find();
db.problems.drop();
db.problemLists.drop();

let ps = [
	{ "dateAdded" : ISODate("2022-12-02T13:43:34.000Z"), "name" : "Problema AA", "problemStatus" : "AC", "editorialStatus" : "READ_AFTER_AC", "comments" : "Levei 2 WAs por usar int ao invés de long long" },
	{ "dateAdded" : ISODate("2022-12-03T14:21:23.000Z"), "name" : "Problema B", "problemStatus" : "AC", "editorialStatus" : "READ_BEFORE_AC", "comments" : "Tive que ler o editorial pra descobrir que era uma PD" },
	{ "dateAdded" : ISODate("2022-12-04T13:56:06.000Z"), "name" : "Problema C", "problemStatus" : "WA", "editorialStatus" : "NOTHING", "comments" : "Tá dando TL, tem que otimizar um pouco mais" }
];

let pids = db.problems.insertMany(ps)["insertedIds"];

let pls = [
	{ "link" : "www.codeforces.com", "name" : "Lista 1", "description" : "Problemas de implementação", "notes" : "Vou deixar pra terminar depois que eu aprender segtree", "dateAdded" : ISODate("2022-12-02T15:43:12.000Z"), "solvedCount" : 0, "totalCount" : 2, "problems" : [ pids[0], pids[1] ] },
	{ "link" : "www.codeforces.com", "name" : "Lista 2", "description" : "Problemas do bixecamp", "notes" : "Tem alguns que eu não resolvi ainda", "dateAdded" : ISODate("2022-12-02T16:24:22.000Z"), "solvedCount" : 6, "totalCount" : 8, "problems" : [ pids[1], pids[2] ] }
]

db.problemLists.insertMany(pls);
