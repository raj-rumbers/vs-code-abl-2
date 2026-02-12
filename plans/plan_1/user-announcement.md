# New Feature: Smart Project Selection 🎯

**Version**: 1.27.0  
**Release Date**: February 2026

---

## What's New?

We're excited to announce **Smart Project Selection** - a major improvement for developers working with multiple OpenEdge projects in a single workspace!

### The Problem We Solved

Previously, when working with multiple projects:
- ❌ You had to manually select a project every time
- ❌ Default project was incorrectly applied to files from other projects
- ❌ This caused confusing syntax errors and workflow interruption

### How It Works Now

The extension now automatically detects which project your file belongs to:

✅ **Auto-Detection**: Opens a file → Extension automatically selects the correct project  
✅ **Smart Override**: Default project setting won't incorrectly override your file's actual project  
✅ **Nested Projects**: Works correctly with nested project structures  
✅ **Fallback**: Only prompts you when auto-detection can't determine the project  

### What You'll Notice

**Before:**
```
1. Open file in ProjectB
2. Execute "ABL: Check Syntax"
3. [❌ Manual selection required] → Select ProjectB
4. Syntax check runs
```

**After:**
```
1. Open file in ProjectB
2. Execute "ABL: Check Syntax"
3. ✨ ProjectB automatically selected
4. Syntax check runs immediately
```

### Commands Affected

Smart project selection now works for:
- Check Syntax
- Preprocess File
- Generate Listing
- Generate Debug Listing
- Generate XREF
- And more!

### You're in Control

- **Default Project**: Still works, but as a smart fallback (not forced)
- **Manual Selection**: Still available when you open files outside projects
- **Transparency**: Check the Output panel to see which project is selected and why

### Need Help?

See README section "Working with Multiple Projects" for detailed examples and troubleshooting.

---

**Enjoy the improved workflow! 🚀**

Questions or feedback? Please open an issue on GitHub.
