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
	{ "dateAdded" : ISODate("2022-12-02T13:43:34.000Z"), "link": "https://codeforces.com/contest/1546/problem/D", "name" : "AquaMoon and Chess", "problemStatus" : "AC", "editorialStatus" : "READ_AFTER_AC", "comments" : "Faltou generalizar o binômio de Newton. Estudar melhor as propriedades." },
	{ "dateAdded" : ISODate("2022-12-03T14:21:23.000Z"), "link": "https://codeforces.com/gym/101845/problem/F", "name" : "UN Finals", "problemStatus" : "AC", "editorialStatus" : "READ_AFTER_AC", "comments" : "Problema de fluxo com a solução bem direta. Usei o template de Dinic do caderno" },
	{ "dateAdded" : ISODate("2022-12-04T13:56:06.000Z"), "link": "https://codeforces.com/problemset/problem/1674/G", "name" : "Remove Directed Edges", "problemStatus" : "WA", "editorialStatus" : "READ_BEFORE_AC", "comments" : "Problema de grafos. Fiquei um bom tempo pensando mas não consegui resolver. Li o início do editorial mas ainda tá dando WA." },
	{ "dateAdded" : ISODate("2022-12-05T16:13:43.000Z"), "link": "https://codeforces.com/contest/855/problem/C", "name" : "Helga Hufflepuff's Cup", "problemStatus" : "READ", "editorialStatus" : "NOTHING", "comments" : "Problema de implementação que precisa ser muito otimizado. Tentei adaptar a minha solução várias vezes mas ainda está muito lento." },
	{ "dateAdded" : ISODate("2022-12-06T13:32:11.000Z"), "link": "https://www.spoj.com/problems/ONP/en/", "name" : "Transform the Expression", "problemStatus" : "AC", "editorialStatus" : "NOTHING", "comments" : "Problema de implementação que envolve transformar uma expressão infixa para pós-fixa." }
];


let pls = [
	{ "link": "https://docs.google.com/spreadsheets/d/1QT-p_Nzb-c6bTdDcnBHq_qRJ7B9biH75014ItH1IIKU/edit?usp=sharing", "name" : "Intensivão DSU/MST", "description" : "Problemas de disjoint set union e minimum spanning tree.", "notes" : "Resolvi todos já, gosto muito desses tipos de problemas", "dateAdded" : ISODate("2022-12-02T15:43:12.000Z"), "solvedCount" : 10, "totalCount" : 10, "problems" : [] },
	{ "link": "https://docs.google.com/spreadsheets/d/1UYEz_PT-p6tsDUUWImWdUvjBxvEw0yspBR7qZ2ChqGM/edit#gid=450914817", "name" : "Problemas de implementação", "description" : "Implementação s2.", "notes" : "Tem só um problema bem difícil faltando.", "dateAdded" : ISODate("2022-11-04T14:24:43.000Z"), "solvedCount" : 9, "totalCount" : 9, "problems" : [3, 4] },
	{ "name" : "Lista de férias 2022", "description" : "Tentar resolver durante as férias", "dateAdded" : ISODate("2022-12-08T13:43:32.000Z"), "solvedCount" : 0, "totalCount" : 0, "problems" : [0, 1, 2, 4] }
]

addUserData(ps, pls, "gustavo_m32")
addUserData(ps, pls, "tubarao")
addUserData(ps, pls, "nathan_luiz")
addUserData(ps, pls, "Carlos_Eduardo_Ferreira")
