import json, subprocess

wins = dict()

for n in range(100):

	result = subprocess.run("lux-ai-2021.cmd --storeLogs false --statefulReplay --loglevel 0 C:\\Users\\Owner\\Desktop\\nox-amara\\main.js .\\bad_bot.js",
							shell=True, capture_output=True, encoding="utf8")

	s = result.stdout

	# Make it a valid JSON string

	s = s.replace('ranks:', '"ranks":')
	s = s.replace('rank:', '"rank":')
	s = s.replace('agentID:', '"agentID":')
	s = s.replace('name:', '"name":')
	s = s.replace('replayFile:', '"replayFile":')
	s = s.replace('seed:', '"seed":')
	s = s.replace("'", '"')

	o = json.loads(s)

	for foo in o["ranks"]:
		if foo["rank"] == 1:
			if foo["name"] in wins:
				wins[foo["name"]] += 1
			else:
				wins[foo["name"]] = 1

for name in wins:
	print(wins[name], name)
