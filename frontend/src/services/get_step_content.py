import json

log_path = r"C:\Users\Acer\.gemini\antigravity-ide\brain\053d3347-d511-44ce-8fd6-2c3d542a6aca\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line_num, line in enumerate(f):
        data = json.loads(line)
        step = data.get('step_index')
        if step in [70, 84]:
            print(f"=== STEP {step} ===")
            print(json.dumps(data, indent=2))
            print("=" * 60)
